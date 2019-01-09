const express = require('express');
const router = express.Router();
const ManagementClient = require('auth0').ManagementClient;
const AuthenticationClient = require('auth0').AuthenticationClient;
const emailValidator = require('email-validator')
const jwtVerifier = require('jsonwebtoken');


require('dotenv').config();

var mgmtAuth0 = new ManagementClient({
//MAKE SURE THIS DOMAIN IS NOT A CUSTOM DOMAIN!!!
  domain: process.env.MGMT_API_DOMAIN,
  clientId: process.env.API_CLIENT_ID,
  clientSecret: process.env.API_CLIENT_SECRET,
  scope: process.env.API_SCOPES
});


var authAuth0 = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.LOGIN_CLIENT,
  clientSecret: process.env.LOGIN_SECRET
});


router.post('/', (req, res) => {

  if(req.body.username && (emailValidator.validate(req.body.username) === true ) && (req.body.password.length >= 8)) {
  var params = {
    connection: process.env.SIGN_UP_CONNECTION,
    email: req.body.username,
    email_verified: false,
    verify_email: true,
    password: req.body.password
  };

  var authData = {
    username: req.body.username,
    password: req.body.password,
    scope: "openid"
};

  mgmtAuth0.createUser(params)
  .then((output) => {      
        authAuth0.oauth.passwordGrant(authData)
        .then((output) => { 
            idToken = jwtVerifier.decode(output.id_token)
            res.send(idToken.sub)
        })
        .catch((err) => {
            res.status(403)
            res.send(err.message)
        })
  })
  .catch((err) => {
      res.status(422)
      res.send(err.message)
  })
}

    else {
        res.status(422)
        res.send("Error: Invalid Request\nEmail needs to be valid and password must be 8 or more characters long") 
        }

  });


module.exports = router;