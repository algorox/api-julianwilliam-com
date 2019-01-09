const express = require('express');
const router = express.Router();
const AuthenticationClient = require('auth0').AuthenticationClient;
const emailValidator = require('email-validator')

require('dotenv').config();

//ROPG Login Service

var authAuth0 = new AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.LOGIN_CLIENT,
    clientSecret: process.env.LOGIN_SECRET
  });

router.post('/', (req, res) => {

    if(req.body.username && (emailValidator.validate(req.body.username) === true )) {
    var data = {
        email: req.body.username,
        connection: req.body.connection
    };

    //Connection should be set here
    authAuth0.requestChangePasswordEmail(data)
    .then((output) => {
        res.send(req.body.username);
    })
    .catch((err) => {
        res.status(403)
        res.send(err.message)
    })
  }
  
      else {
          res.status(422)
          res.send("Error: Invalid Request") 
          }
    });
  

module.exports = router;