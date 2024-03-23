// app.js
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const compression = require("compression");
const helmet = require("helmet");

// Define the directory where your static files are located
app.use(express.static(__dirname));
app.use(compression()); // Compress all routes
/* app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
); */


module.exports = { app, port };
