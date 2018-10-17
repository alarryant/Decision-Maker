"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

// stuff imported from tinyapp
// // stuff imported from tinyapp
// // generate random string for unique URL to share?
// function generateRandomString() {
// var randomString = '';
// const possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
//   for (let i = 0; i < 6; i++) {
//   randomString += possibleChars[getRandomInt(0, 61)];
//   };
//   return randomString;
// }

// // route for shareable link
// app.get("/u/:RANDOMSTRING", (req, res) => {

// });

// route for admin page w/ access to results
app.get("/id/:RANDOMSTRING", (req, res) => {
    let templateVars = {}
    res.render("urls_show", templateVars);
  // urls_show would be results page
});

// delete a poll option
app.post("/id/:RANDOMSTRING/delete", (req, res) => {
  delete // resource from database
  res.redirect('/id');
});

// edit a poll option
app.post("/id/:RANDOMSTRING", (req, res) => {
    urlDatabaseKey.longURL = req.body.longURL;// will be new poll option
    res.redirect(`/id/${RANDOMSTRING}`);
});
// // route for admin page w/ access to results
// app.get("/urls/:RANDOMSTRING", (req, res) => {
//     let templateVars = {}
//     res.render("urls_show", templateVars);
//   // urls_show would be results page
// });

// // delete a poll option
// app.post("/urls/:RANDOMSTRING/delete", (req, res) => {
//   delete // resource from database
//   res.redirect('/urls');
// });
