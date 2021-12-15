const courses = (app, pool) => {
  // para hacer consultas secuenciales
  const query = function (sql, values) {
    // devolver una promesa
    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          reject(err);
          return;
        }

        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          // finaliza la sesión
          connection.release();
        });
      });
    });
  };

  // Mostrar todos los cursos que están públicos
  // 2 = público
  // 1 = privado
  // 0 = eliminado
  app.get('/courses', (request, response) => {
    pool.query('SELECT * FROM courses WHERE status = ?', 2, (error, result) => {
      if (error) throw error;

      response.send(result);
    });
  });

  // Obtener un curso
  app.get('/courses/:id', (request, response) => {
    const id = request.params.id;

    pool.query('SELECT * FROM courses WHERE id = ?', id, (error, result) => {
      if (error) throw error;

      const course = result[0];

      pool.query(
        'SELECT * FROM courses_data WHERE course_id = ? AND status = ?',
        [id, 1],
        (error, result) => {
          if (error) throw error;

          course.words = result;

          response.json(course);
        }
      );
    });
  });

  // cursos que cursa un usuario
  app.get('/courses/user/:id', (request, response) => {
    const id = request.params.id;

    pool.query(
      'SELECT * FROM courses WHERE id IN (SELECT course_id FROM users_courses WHERE user_id = ? AND status = ?) AND status != ?',
      [id, 1, 0],
      (error, result) => {
        if (error) throw error;

        response.json(result);
      }
    );
  });

  // Agregar un curso
  app.post('/courses/add', (request, response) => {
    const course = request.body;

    pool.query(
      `INSERT INTO courses (user_id, name, description, image, status) VALUES (?, ?, ?, ?, ?)`,
      [
        course.user_id,
        course.name,
        course.description,
        course.image,
        course.status,
      ],
      async (error, result) => {
        if (error) throw error;

        const course_id = result.insertId;

        // Guardar las conceptos sencuencialmente
        for (const word of course.words) {
          await query(
            'INSERT INTO courses_data (course_id, concept, answer) VALUES (?, ?, ?)',
            [course_id, word.concept, word.answer],
            (error, result) => {
              if (error) throw error;
            }
          );
        }

        await query(
          'INSERT INTO users_courses (user_id, course_id) VALUES (?, ?)',
          [course.user_id, course_id],
          (error, result) => {
            if (error) throw error;
          }
        );

        response.send(result.insertId.toString());
      }
    );
  });

  // Actualizar un curso
  app.post('/courses/update', (request, response) => {
    const course = request.body;

    console.log(course);

    pool.query(
      'UPDATE courses SET name = ?, description = ?, image = ?, status = ? WHERE id = ?',
      [course.name, course.description, course.image, course.status, course.id],
      async (error, result) => {
        if (error) throw error;

        for (const word of course.words) {
          if (word.deleted) {
            await query(
              'UPDATE courses_data SET status = ? WHERE id = ?',
              [0, word.id],
              (error, result) => {
                if (error) throw error;
              }
            );
          } else if (word.id) {
            await query(
              'UPDATE courses_data SET concept = ?, answer = ? WHERE id = ?',
              [word.concept, word.answer, word.id],
              (error, result) => {
                if (error) throw error;
              }
            );
          } else {
            await query(
              'INSERT INTO courses_data (course_id, concept, answer) VALUES (?, ?, ?)',
              [course.id, word.concept, word.answer],
              (error, result) => {
                if (error) throw error;
              }
            );
          }
        }

        response.end();
      }
    );
  });

  // Eliminar un curso
  app.get('/courses/delete/:id', (request, response) => {
    const id = request.params.id;

    pool.query(
      'UPDATE courses SET status = ? WHERE id = ?',
      [0, id],
      (error, result) => {
        if (error) throw error;
        response.end();
      }
    );
  });

  // Obtener los conceptos de un curso
  app.get('/courses/:id/concepts', (request, response) => {
    const id = request.params.id;

    pool.query(
      'SELECT id, course_id, concept, answer FROM courses_data WHERE course_id = ? AND status = ?',
      [id, 1],
      (error, result) => {
        if (error) throw error;

        response.json(result);
      }
    );
  });

  // agregar concepto aprendido de un usuario
  app.post('/courses/learnedConcept/add', (request, response) => {
    const concept = request.body;

    pool.query(
      'INSERT INTO users_data (user_id, course_id, concept_id, correct_answers, attempts, time_spent) VALUES (?, ?, ?, ?, ?, ?)',
      [
        concept.user_id,
        concept.concept.course_id,
        concept.concept.id,
        concept.correct_answers,
        concept.attempts,
        concept.time_spent,
      ],
      (error, result) => {
        if (error) throw error;
        response.send(result.insertId.toString());
      }
    );
  });

  app.post('/courses/learnedConcepts', (request, response) => {
    const req = request.body;

    pool.query(
      'SELECT * FROM users_data WHERE user_id = ? AND course_id = ?',
      [req.user_id, req.course_id],
      (error, result) => {
        if (error) throw error;

        response.json(result);
      }
    );
  });

  app.post('/courses/learnedConcept/update', (request, response) => {
    const concept = request.body;

    pool.query(
      'UPDATE users_data SET correct_answers = ?, learned = ?, attempts = ?, time_spent = ?, time_review = ? WHERE user_id = ? AND course_id = ? AND concept_id = ?',
      [
        concept.correct_answers,
        concept.learned,
        concept.attempts,
        concept.time_spent,
        concept.time_review,
        concept.user_id,
        concept.concept.course_id,
        concept.concept.id,
      ],
      (error, result) => {
        if (error) throw error;
        response.end();
      }
    );
  });

  app.post('/courses/points/update', async (request, response) => {
    const req = request.body;

    let points = 0;

    await query(
      'SELECT points FROM users_courses WHERE user_id = ? AND course_id = ?',
      [req.user_id, req.course_id]
    ).then((result) => {
      points = Number(req.points) + result[0].points;
    });

    await query(
      'UPDATE users_courses SET points = ? WHERE user_id = ? AND course_id = ?',
      [points, req.user_id, req.course_id]
    );

    // limpiar los datos temporales
    await query(
      'SELECT * FROM users_data WHERE user_id = ? AND course_id = ?',
      [req.user_id, req.course_id]
    ).then((result) => {
      const user_data = JSON.parse(JSON.stringify(result));

      for (const data of user_data) {
        data.attempts = 0;
        data.time_spent = 0;

        pool.query(
          'UPDATE users_data SET attempts = ?, time_spent = ? WHERE user_id = ? AND course_id = ? AND concept_id = ?',
          [
            data.attempts,
            data.time_spent,
            data.user_id,
            data.course_id,
            data.concept_id,
          ],
          (error, result) => {
            if (error) throw error;
          }
        );
      }
    });

    response.end();
  });

  app.post('/courses/user/join/', async (request, response) => {
    const req = request.body;

    let exist = false;

    await query(
      'SELECT EXISTS(SELECT 1 FROM users_courses WHERE user_id = ? AND course_id = ?) as exist',
      [req.user_id, req.course_id]
    ).then((result) => {
      exist = result[0].exist;
    });

    if (!exist) {
      pool.query(
        'INSERT INTO users_courses (user_id, course_id) VALUES (?, ?)',
        [req.userId, req.courseId],
        (error, result) => {
          if (error) throw error;

          response.send(result.insertId.toString());
        }
      );
    } else {
      pool.query(
        'UPDATE users_courses SET status = ? WHERE user_id = ? AND course_id = ?',
        [1, req.userId, req.courseId],
        (error, result) => {
          if (error) throw error;

          response.end();
        }
      );
    }
  });

  app.post('/courses/user/joined/', (request, response) => {
    const req = request.body;

    pool.query(
      'SELECT EXISTS(SELECT 1 FROM users_courses WHERE user_id = ? AND course_id = ? AND status = ?) as exist',
      [req.userId, req.courseId, 1],
      (error, result) => {
        if (error) throw error;

        response.send(result[0].exist.toString());
      }
    );
  });

  app.post('/courses/user/unjoin/', (request, response) => {
    const req = request.body;

    pool.query(
      'UPDATE users_courses SET status = ? WHERE user_id = ? AND course_id = ?',
      [0, req.userId, req.courseId],
      (error, result) => {
        if (error) throw error;

        response.end();
      }
    );
  });

  app.post('/courses/user/restart/', async (request, response) => {
    const req = request.body;

    await query('DELETE FROM users_data WHERE user_id = ? AND course_id = ?', [
      req.userId,
      req.courseId,
    ]);

    await query(
      'UPDATE users_courses SET points = ? WHERE user_id = ? AND course_id = ?',
      [0, req.userId, req.courseId]
    );

    response.end();
  });
};

// Export the courses
module.exports = courses;
