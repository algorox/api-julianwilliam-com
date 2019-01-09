const express = require('express');
const router = express.Router();
const AuthenticationClient = require('auth0').AuthenticationClient;
const jwtVerifier = require('jsonwebtoken');
const emailValidator = require('email-validator')

require('dotenv').config();

//ROPG Login Service

var auth0 = new AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.LOGIN_CLIENT,
    clientSecret: process.env.LOGIN_SECRET
  });

router.post('/', (req, res) => {

    if(req.body.username && (emailValidator.validate(req.body.username) === true )) {
    var data = {
        username: req.body.username,
        password: req.body.password,
        scope: "openid"
    };
    
    auth0.oauth.passwordGrant(data)
    .then((output) => { 
        idToken = jwtVerifier.decode(output.id_token)
        res.send(idToken.sub)
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