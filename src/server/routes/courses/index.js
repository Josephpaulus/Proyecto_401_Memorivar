// Route the app
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
    pool.query('SELECT * FROM cursos WHERE estado = ?', 2, (error, result) => {
      if (error) throw error;

      response.send(result);
    });
  });

  // Obtener un curso
  app.get('/courses/:id', (request, response) => {
    const id = request.params.id;

    pool.query('SELECT * FROM cursos WHERE id = ?', id, (error, result) => {
      if (error) throw error;

      response.send(result);
    });
  });

  // Agregar un curso
  app.post('/courses/add', (request, response) => {
    const course = request.body;

    pool.query(
      `INSERT INTO cursos (nombre, descripcion, estado) VALUES (?, ?, ?)`,
      [course.name, course.description, course.courseStatus],
      async (error, result) => {
        if (error) throw error;

        const course_id = result.insertId;

        // Guardar las conceptos sencuencialmente
        for (const word of course.words) {
          await query(
            'INSERT INTO cursos_datos (id_curso, concepto, respuesta) VALUES (?, ?, ?)',
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
      'UPDATE cursos SET nombre = ?, descripcion = ? WHERE id = ?',
      [course.nombre, course.descripcion, id],
      (error, result) => {
        if (error) throw error;

        response.send('Curso actualizado.');
      }
    );
  });

  // Eliminar un curso
  app.get('/courses/delete/:id', (request, response) => {
    const id = request.params.id;

    pool.query(
      'UPDATE cursos SET estado = ? WHERE id = ?',
      [0, id],
      (error, result) => {
        if (error) throw error;
        response.send('Curso elminado.');
      }
    );
  });
};

// Export the courses
module.exports = courses;
