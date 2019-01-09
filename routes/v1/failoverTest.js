const express = require('express');
const router = express.Router();

require('dotenv').config();

router.get('/', (req, res) => {

    res.status(503)

});

module.exports = router;