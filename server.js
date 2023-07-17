const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const router1 = express.Router();


const { auth } = require('express-openid-connect');

dotenv.load();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const config = {
  authRequired: true,
  auth0Logout: true,
  clientSecret:  process.env.SECRET,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  //clientSecret:  'raQ4sYpq-5z45N1gKTWYCsLS9bWh8u494X_dyp8ho0V5gjxOa2OKLc8iVgHEQUVc',
  //clientID: 'leNzWgko5u0v6kJGCbS5xcOusG1aGklK',
  //issuerBaseURL: 'https://467-summer-2023.us.auth0.com',
  authorizationParams: {
    response_type: "code",

    audience: "https://job-tracker-api",
  },
};

const port = process.env.PORT || 3002;
if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}

const applications = [
  { name: 'JBLM', sub: 'google-oauth2|109472092890806403385' },
  { name: 'Tekronix', sub: 'google-oauth2|109472092890806403385' },
  { name: 'ST Micro', sub: 'auth0|64b0c45ef7a0dfd00ea35752' },
  { name: 'Honeywell', sub: 'google-oauth2|109472092890806403385' },
  { name: 'KMC Controls', sub: 'auth0|64b0c421f7a0dfd00ea3574c' }
];

const jobs = [
  { name: 'MD', description: 'Drone Programmer' },
  { name: 'Tekronix', description: 'Scope Firmware Developer' },
  { name: 'ST Micro', description: 'Technical Sales' },
  { name: 'Honeywell', description: 'Websquad Level 2' },
  { name: 'KMC Controls', description: 'NW Account Exec' }
];


app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

app.use('/', router1);

//------------------------------------------------Functions----------------------------------------------



//---------------------------------------------------Routes----------------------------------------------
router1.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router1.get('/profile', function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    idToken: req.oidc.idToken,
    accessToken: req.oidc.accessToken.access_token,
    sub: req.oidc.user.sub,
    title: 'Profile page'
  });
});

router1.get('/apps', function (req, res, next) {
  var filteredApplications = applications.filter((area) => area.sub === req.oidc.user.sub);
  res.send(filteredApplications);
});

router1.get('/jobs', function (req, res, next) {
  res.send(jobs);
});


//---------------------------------------Error Handling----------------------------------------------------------

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {}
  });
});

http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on ${config.baseURL}`);
  });
