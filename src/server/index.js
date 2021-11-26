// Require packages and set the port
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes')
const app = express();
const port = 3000;

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(cors());

// Load the MySQL pool connection
const pool = require('./config');

routes(app, pool);

// Start the server
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});