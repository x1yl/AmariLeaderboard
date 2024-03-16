// app.js
const express = require("express");
const app = express();
const port = 3000;
const compression = require("compression");
const helmet = require("helmet");

// Define the directory where your static files are located
app.use(express.static(__dirname));
app.use(compression()); // Compress all routes
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

module.exports = { app, port };
