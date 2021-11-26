// Módulos
const courses = require('./courses');

// Route the app
const router = (app, pool) => {
  // Raíz
  app.get('/', (request, response) => {
    response.send('');
  });

  courses(app, pool);
};

// Export the router
module.exports = router;
