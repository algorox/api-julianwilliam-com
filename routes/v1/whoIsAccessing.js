const express = require('express');
const router = express.Router();

require('dotenv').config();

router.get('/', (req, res) => {

if(req.user.sub){

    var params = {
        id: req.user.sub
      };

      res.setHeader('Content-Type', 'application/json');
      res.send({"API is being accessed by this user": params});
    }

else {
    res.status(422)
    res.send("Error: Invalid Request") 
}

});

module.exports = router;