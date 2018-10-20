'use strict';

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const app = express();
//

const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');
const functions = require('./export-functions.js');

// Seperated Routes for each Resource
const usersRoutes = require('./routes/users');

var mailgun = require("mailgun-js");
var api_key = process.env.MAILGUN_API;
var DOMAIN = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  '/styles',
  sass({
    src: __dirname + '/styles',
    dest: __dirname + '/public/styles',
    debug: true,
    outputStyle: 'expanded'
  })
);
app.use(express.static('public'));

// Mount all resource routes
app.use('/api/users', usersRoutes(knex));

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});

app.post('/create', (req, res) => {
  const randomURL = functions.generateRandomString();

  console.log(req.body);
  if(req.body.email === '' || req.body.title === '' || req.body.options[0] === ''){
    res.redirect('./');
  } else {
  //inserting poll table into database
    knex('poll')
    .returning('*')
    .insert({ name: req.body.title, description: req.body.description, email: req.body.email, url: randomURL })
    .then((data) => {

      // var good_options = req.body.options.filter(op => op.length && op.length > 0);
      // var insert_objects = good_options.map(op => ({text: op, votes: 0, poll_id: data[0].id}))
      // knex('option')
      // .returning('*')
      // .insert(insert_objects)

      var insert_promises = [];
      for (let i = 0; i < req.body.options.length; i ++){
        var option_text = req.body.options[i];
        if(option_text === '') {
          console.log("WHAt")
        } else {
          insert_promises.push(
            knex('option')
            .returning('*')
            .insert({ text: option_text, votes: 0, poll_id: data[0].id })
          );
        }
      }

      Promise.all(insert_promises)
      .then((data) => {
        res.redirect(`/admin/${randomURL}`);
      }).catch(err => {
        console.log("y tho", err);
        res.redirect('./');
      })


    }).catch(err => {
      console.log("y tho", err);
      res.redirect('./');
    })

  }

  var data = {
    from: 'Decision Maker <postmaster@sandbox648386da93cf4c79af7f46bd8fb0719c.mailgun.org>',
    to: req.body.email,
    subject: 'Thank you for using Decision Maker!',
    text: `Your poll, ${req.body.title}, has been created. \n\nHere is the link to your results: localhost:8080/${randomURL}/admin \n\nHere is the shareable link to your poll: localhost:8080/${randomURL}`
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });

});

app.get('/admin/:id', (req, res) => {
  let randomURL = req.params.id;
  knex.select('text', 'poll.name')
    .from('option')
    .join('poll', 'poll_id', '=', 'poll.id')
    .where('poll.url', '=', randomURL)
    // orders from highest votes to lowest
    .orderBy('option.votes', 'desc')
    .asCallback((err, options) => {
            if (err) throw err;
      // passing through options with option text and title of poll to admin page
      let templateVars = {
        options,
        randomURL
      };
  res.render('admin', templateVars);
  });
});

app.get('/:id', (req, res) => {
  knex
    .select('option.text', 'poll.name')
    .from('option')
    .join('poll', 'poll_id', '=', 'poll.id')
    .where('poll.url', 'like', req.params.id)
    .asCallback((err, option) => {
      if (err) throw (err);
      let templateVars = {
        option,
        randomURL: req.params.id
      };
      res.render('poll', templateVars);
    });
});

app.post('/vote', (req, res) => {
  let options = req.body.option;
  let randomURL = req.body.randomURL;

  knex('poll').select('email', 'name').where('url', '=', randomURL).then((info) => {
    var data = {
      from: 'Decision Maker <postmaster@sandbox648386da93cf4c79af7f46bd8fb0719c.mailgun.org>',
      to: info[0].email,
      subject: `Someone just voted in this poll: ${info[0].name}!`,
      text: `Here is the link to the results: localhost:8080/${randomURL}/admin`
    };
    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    })
  });

  // store in promise new array of data to access later
  return new Promise((resolve,reject) => {
  resolve(knex.from('option').join('poll', 'poll_id', 'poll.id' ).where('poll.url', 'like', randomURL));
  })
  .then((data) => {
    //loop through new data and increment columns
    const votePromise = [];
    for(let i = 0; i < data.length; i ++){
      votePromise.push(
      knex('option')
        .returning('*')
        .where({text: options[i], poll_id: data[i].id })
        .increment('votes', options.length - i));
    }
  Promise.all(votePromise)
  .then((data) => {
    console.log(data);
  })
 })

});




