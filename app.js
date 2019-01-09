const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtScopes = require('express-jwt-authz')
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const getUser = require('./routes/v1/getUser')
const createPWlessUser= require('./routes/v1/createPWlessUser')
const checkMyJWT = require('./routes/v1/checkMyJWT')
const whoIsAccessing = require('./routes/v1/whoIsAccessing')
const login = require('./routes/v1/login')
const phishing = require('./routes/v1/phishing')
const changePassword = require('./routes/v1/changePassword')
const resetPassword = require('./routes/v1/resetPassword')
const signUp = require('./routes/v1/signUp')
const deleteUser = require('./routes/v1/deleteUser')
const failoverTest = require('./routes/v1/failoverTest')
const ExpressBrute = require('express-brute');

require('dotenv').config();

const bruteStore = new ExpressBrute.MemoryStore();
const bruteOptions = {
  freeRetries: 5,
  minWait: 10000
}
const bruteForce = new ExpressBrute(bruteStore, bruteOptions);

require('dotenv').config();

//const port = 3003;
const port = process.env.PORT || 3003;
const domain = process.env.AUTH0_DOMAIN;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Validate the access token and enable the use of the jwtCheck middleware
const access_token = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer
  audience: process.env.API_AUDIENCE,
  issuer: `https://${domain}/`,
  algorithms: [ 'RS256' ]
});

const checkReadUserScopes = jwtScopes(['read:user'])

//MUST NOT BE REMOVED
app.use('/', bruteForce.prevent)
app.use('/api/private', access_token, checkReadUserScopes)
//MUST NOT BE REMOVED


//Routes set-up
app.use('/api/private/whoIsAccessing', whoIsAccessing)

app.use('/api/private/getUser', getUser);

app.use('/api/public/checkMyJWT', checkMyJWT);

app.use('/api/public/deleteUser', deleteUser);

app.use('/api/public/createPWlessUser', createPWlessUser);

app.use('/api/public/login', login)

app.use('/api/public/phishing', phishing)

app.use('/api/public/changePassword', changePassword)

app.use('/api/public/resetPassword', resetPassword)

app.use('/api/public/signUp', signUp)

app.use('/api/public/login', login)

app.use('/api/public/failover_test', failoverTest)

app.listen(port, function () {
  console.log('API Services started on port: ' + port);
});