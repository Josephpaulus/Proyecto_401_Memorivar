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
        'SELECT * FROM courses_data WHERE course_id = ?',
        id,
        (error, result) => {
          if (error) throw error;

          course.words = result;

          response.json(course);
        }
      );
    });
  });

  // Agregar un curso
  app.post('/courses/add', (request, response) => {
    const course = request.body;

    pool.query(
      `INSERT INTO courses (name, description, status) VALUES (?, ?, ?)`,
      [course.name, course.description, course.courseStatus],
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

        response.send(result.insertId.toString());
      }
    );
  });

  // Actualizar un curso
  app.post('/courses/update/:id', (request, response) => {
    const id = request.params.id;
    const course = request.body;

    pool.query(
      'UPDATE course SET name = ?, description = ? WHERE id = ?',
      [course.nombre, course.descripcion, id],
      (error, result) => {
        if (error) throw error;

        response.end();
      }
    );
  });

  // Eliminar un curso
  app.get('/courses/delete/:id', (request, response) => {
    const id = request.params.id;

    pool.query(
      'UPDATE course SET status = ? WHERE id = ?',
      [0, id],
      (error, result) => {
        if (error) throw error;
        response.end();
      }
    );
  });
};

// Export the courses
module.exports = courses;
