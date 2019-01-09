const express = require('express');
const router = express.Router();
const jwtVerifier = require('jsonwebtoken');

require('dotenv').config();

var jwtVerifierOptions = {
    audience: process.env.PP_AUDIENCE,
    issuer: process.env.PP_ISSUER,
    algorithms: 'HS256'
  }

router.get('/', (req, res) => {

        if(req.query.token){

            var token = req.query.token;

           jwtVerifier.verify(token, process.env.PP_SIGNING_KEY, jwtVerifierOptions, function(err, decoded) {

            if(err) {
            console.log(err);
            res.status(422)
            res.send(err) 
            }
            else {
            res.setHeader('Content-Type', 'application/json');    
            res.send(decoded) 
            }
            });
        }
        else {
            res.status(422)
            res.send("Error: Invalid Request") 
        }

});

module.exports = router;