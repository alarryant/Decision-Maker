'use strict';

const express = require('express');
const router = express.Router();
const functions = require('../export-functions.js');

var mailgun = require('mailgun-js');
var api_key = process.env.MAILGUN_API;
var DOMAIN = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });

module.exports = knex => {
  router.get('/thanks', (req, res) => {
    res.render('thanks');
  });

// voting page
  router.get('/user/:id', (req, res) => {
    let randomURL = req.params.id;

    knex
      .select('option.text', 'poll.name', 'poll.description')
      .from('option')
      .join('poll', 'poll_id', '=', 'poll.id')
      .where('poll.url', 'like', `%${randomURL}%`)
      .asCallback((err, option) => {
        if (err) throw err;
        let templateVars = {
          option,
          randomURL
        };
        res.render('poll', templateVars);
      });
  });

// create a poll form submission
  router.post('/create', (req, res) => {
    let randomURL = functions.generateRandomString();

    if (req.body.email === '' || req.body.title === '' || req.body.options[0] === '') {
      res.status(400).json({ error: 'invalid request: no data in POST body' });
      return;

    } else {
      //inserting poll table into database
      knex('poll')
        .returning('*')
        .insert({
          name: req.body.title,
          description: req.body.description,
          email: req.body.email,
          url: randomURL
        })
        .then(data => {
          // var good_options = req.body.options.filter(op => op.length && op.length > 0);
          // var insert_objects = good_options.map(op => ({text: op, votes: 0, poll_id: data[0].id}))
          // knex('option')
          // .returning('*')
          // .insert(insert_objects)

          var insert_promises = [];
          for (let i = 0; i < req.body.options.length; i++) {
            const option_text = req.body.options[i];
            if (option_text === '') {
              console.log('WHAt');
            } else {
              insert_promises.push(
                knex('option')
                  .returning('*')
                  .insert({
                    text: option_text,
                    votes: 0,
                    poll_id: data[0].id
                  }));
            }
          }

          Promise.all(insert_promises)
            .then(data => {
              res.redirect(`/api/users/admin/${randomURL}`);
            })
            .catch(err => {
              console.log('y tho', err);
              res.redirect('/');
            });
        })
        .catch(err => {
          console.log('y tho', err);
          res.redirect('/');
        });
    }

    // mailgun
    const data = {
      from: 'Choo Choose <postmaster@sandbox648386da93cf4c79af7f46bd8fb0719c.mailgun.org>',
      to: req.body.email,
      subject: 'Thank you for using Choo-Choose!',
      text: `Your poll, "${req.body.title}", has been created. \n\nHere is the link to your results: localhost:8080/api/users/admin/${randomURL} \n\nHere is the shareable link to your poll: localhost:8080/api/users/user/${randomURL}`
    };

    mailgun.messages().send(data, function(error, body) {
      console.log(body);
    });
  });

  router.get('/admin/:id', (req, res) => {
    let randomURL = req.params.id;
    knex
      .select('text', 'poll.name')
      .from('option')
      .join('poll', 'poll_id', '=', 'poll.id')
      .where('poll.url', 'like', `%${randomURL}%`)
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

  // vote form submission
  router.post('/vote', (req, res) => {
    let options = req.body.option;
    let randomURL = req.body.randomURL;

    knex('poll')
      .select('email', 'name')
      .where('url', '=', randomURL)
      .then(info => {
        // mailgun
        var data = {
          from: 'Choo Choose <postmaster@sandbox648386da93cf4c79af7f46bd8fb0719c.mailgun.org>',
          to: `${info[0].email}`,
          subject: `Someone just voted in this poll: ${info[0].name}!`,
          text: `Here is the link to the results: localhost:8080/api/users/admin/${randomURL}`
        };
        mailgun.messages().send(data, function(error, body) {
          console.log(body);
        });
      });

    // store in promise new array of data to access later
    return new Promise((resolve, reject) => {
      resolve(
        knex
          .from('option')
          .join('poll', 'poll_id', 'poll.id')
          .where('poll.url', 'like', `%${randomURL}%`)
      );
    })
      .then(data => {
        //loop through new data and increment columns
        const votePromise = [];
        for (let i = 0; i < data.length; i++) {
          votePromise.push(
            knex('option')
              .returning('*')
              .where({ text: options[i], poll_id: data[i].id })
              .increment('votes', options.length - i)
          );
        }
        Promise.all(votePromise)
          .then(data => {
            res.json({ result: 'True' });
          })
          .catch(err => {
            console.log("what's this err", err);
          });
      })
      .catch(err => {
        console.log('WHHHHY', err);
      });
  });

  return router;
};
