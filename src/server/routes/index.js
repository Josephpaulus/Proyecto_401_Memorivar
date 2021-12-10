// Módulos
const courses = require('./courses');
const users = require('./users');

// Route the app
const router = (app, pool) => {
  // Raíz
  app.get('/', (request, response) => {
    response.send('');
  });

  users(app, pool);
  courses(app, pool);
};

// Export the router
module.exports = router;
