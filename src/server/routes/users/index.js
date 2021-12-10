const users = (app, pool) => {
  // login
  app.post('/users/login', (request, response) => {
    const user = request.body;

    pool.query(
      'SELECT id, rol_id, user, email, image FROM users WHERE user = ? AND password = ? AND status = 1',
      [user.user, user.password],
      (error, result) => {
        if (error) throw error;

        const data = JSON.parse(JSON.stringify(result));

        console.log(data);

        response.json({
          success: data.length > 0,
          data: data.length > 0 ? data[0] : null,
        });
      }
    );
  });

  // obtener datos de un usuario
  app.get('/users/:id', (request, response) => {
    const id = request.params.id;

    pool.query(
      'SELECT id, rol_id, user, email, image FROM users WHERE id = ?',
      id,
      (error, result) => {
        if (error) throw error;

        response.json(result[0]);
      }
    );
  });

  // agregar un usuario
  app.post('/users/add', (request, response) => {
    const user = request.body;

    console.log(user);

    if (!user.user || !user.password || !user.email) {
      response.json({
        success: false,
      });

      return;
    }

    pool.query(
      `INSERT INTO users (user, password, email) VALUES (?, ?, ?)`,
      [user.user, user.password, user.email],
      (error, result) => {
        if (error) throw error;

        response.json({
          success: !isNaN(result.insertId),
        });
      }
    );
  });

  // actualizar un usuario
  app.post('/users/update', (request, response) => {
    const user = request.body;

    pool.query(
      'UPDATE users SET password = ?, email = ?, image = ? WHERE id = ?',
      [user.password, user.email, user.image, user.id],
      (error, result) => {
        if (error) throw error;

        response.end();
      }
    );
  });
};

// Export the users
module.exports = users;
