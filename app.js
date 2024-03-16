// app.js
const express = require("express");
const app = express();
const port = 3000;

// Define the directory where your static files are located
app.use(express.static(__dirname));

module.exports = { app, port };
