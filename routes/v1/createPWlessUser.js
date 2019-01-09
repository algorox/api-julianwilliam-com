const express = require('express');
const router = express.Router();
const ManagementClient = require('auth0').ManagementClient;
const emailValidator = require('email-validator')

require('dotenv').config();

var auth0 = new ManagementClient({
//MAKE SURE THIS DOMAIN IS NOT A CUSTOM DOMAIN!!!
  domain: process.env.MGMT_API_DOMAIN,
  clientId: process.env.API_CLIENT_ID,
  clientSecret: process.env.API_CLIENT_SECRET,
  scope: process.env.API_SCOPES
});


router.get('/', (req, res) => {

  if(req.query.email && (emailValidator.validate(req.query.email) === true )) {
  var params = {
    connection: "email",
    email: req.query.email,
    email_verified: false,
    verify_email: true,
  };

  auth0.createUser(params)
  .then((output) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(output)
  })
  .catch((err) => {
      res.status(422)
      res.send(err)
  })
}

    else {
        res.status(422)
        res.send("Error: Invalid Request") 
        }

  });


module.exports = router;