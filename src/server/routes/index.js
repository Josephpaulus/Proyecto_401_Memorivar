// Módulos
const users = require('./users');
const courses = require('./courses');
const challenges = require('./courses/challenges');

// Route the app
const router = (app, pool) => {
  // Raíz
  app.get('/', (request, response) => {
    response.send('');
  });

  users(app, pool);
  courses(app, pool);
  challenges(app, pool);
};

// Export the router
module.exports = router;
