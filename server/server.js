const express = require("express");
const mongoose = require("mongoose");

const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

//BODY PARSER MIDDLEWARE: This run before the request from client hits the server
app.use(xss());
app.use(mongoSanitize());

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
