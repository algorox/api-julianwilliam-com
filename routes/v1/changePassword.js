const express = require('express');
const router = express.Router();
const AuthenticationClient = require('auth0').AuthenticationClient;
const ManagementClient = require('auth0').ManagementClient;
const jwtVerifier = require('jsonwebtoken');
const emailValidator = require('email-validator');

require('dotenv').config();

//ROPG Login Service

var authAuth0 = new AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.LOGIN_CLIENT,
    clientSecret: process.env.LOGIN_SECRET
  });

var mgmtAuth0 = new ManagementClient({
//MAKE SURE THIS DOMAIN IS NOT A CUSTOM DOMAIN!!!
      domain: process.env.MGMT_API_DOMAIN,
      clientId: process.env.API_CLIENT_ID,
      clientSecret: process.env.API_CLIENT_SECRET,
      scope: process.env.API_SCOPES
    });  

router.post('/', (req, res) => {

    if(req.body.username && (emailValidator.validate(req.body.username) === true ) && (req.body.newPassword.length >= 8)) {
    var data = {
        username: req.body.username,
        password: req.body.password,
        scope: "openid"
    };

    //Connection should be set here
    var passwordData = {
        connection: process.env.SIGN_UP_CONNECTION,
        password: req.body.newPassword
    }
    
    authAuth0.oauth.passwordGrant(data)
    .then((output) => {
        idToken = jwtVerifier.decode(output.id_token)

        var params = {
            id: idToken.sub
        }

        mgmtAuth0.updateUser(params, passwordData)
        .then((passwordUpdate) => {
            res.send(passwordUpdate.email)
        })
        .catch((err) => {
            res.status(422)
            res.send(err.message)
        })
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