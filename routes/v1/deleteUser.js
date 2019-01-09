const express = require('express');
const router = express.Router();
const ManagementClient = require('auth0').ManagementClient;
const AuthenticationClient = require('auth0').AuthenticationClient;
const emailValidator = require('email-validator');
const jwtVerifier = require('jsonwebtoken');

require('dotenv').config();

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

    if(req.body.username && (emailValidator.validate(req.body.username) === true )) {
    var data = {
        username: req.body.username,
        password: req.body.password,
        scope: "openid"
    };

    authAuth0.oauth.passwordGrant(data)
    .then((output) => {
        idToken = jwtVerifier.decode(output.id_token)

        var params = {
            id: idToken.sub
        }

        mgmtAuth0.deleteUser(params)
        .then((output) => {
            res.send({message: "User Deleted Successfully"})
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