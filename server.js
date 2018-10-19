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
const functions   = require('./export-functions.js');
//

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


app.post("/create", (req, res) => {
  const randomURL = functions.generateRandomString();

  //inserting poll table into database
  knex('poll').returning('*').insert({name: req.body.title, description: req.body.description, email: req.body.email, url: randomURL}).asCallback((err, rows)=> {
    if (err) throw err;

    //loop through options and add to database
    for(let i = 0; i < req.body.options.length; i ++){
      knex('option').returning('*').insert({text: req.body.options[i], votes: 0, poll_id: rows[0].id}).asCallback((err) => {
        if (err) throw err;
      });
    }
  });

  res.redirect(`/${randomURL}/admin`);
});

app.get('/:id/admin', (req, res) => {
  res.render('admin');
});

app.get('/:id', (req, res) => {
  let pollID = knex.select('option.text')
    .from('option')
    .join('poll', 'poll_id', '=', 'poll.id')
    .where('poll.url', 'like', req.params.id)
    .asCallback((err, option) => {
      if (err) throw (err);
      let templateVars = {
        option,
      };
      res.render('poll', templateVars);
    });
});

app.post('/vote', (req, res) => {
  console.log(req.body);

});

// When user creates

// POST /create
// Redirect to GET /:id/admin

// When a user votes

// POST /:id/vote
// Redirect /thanks
