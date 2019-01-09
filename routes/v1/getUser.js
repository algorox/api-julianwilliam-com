const express = require('express');
const router = express.Router();
const ManagementClient = require('auth0').ManagementClient;

require('dotenv').config();

var auth0 = new ManagementClient({
//MAKE SURE THIS DOMAIN IS NOT A CUSTOM DOMAIN!!!
  domain: process.env.MGMT_API_DOMAIN,
  clientId: process.env.API_CLIENT_ID,
  clientSecret: process.env.API_CLIENT_SECRET,
  scope: process.env.API_SCOPES
});


router.get('/', (req, res) => {

if(req.user.sub){

    var params = {
        id: req.user.sub
      };

auth0.getUser(params)
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