// Import dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Import route handlers
var indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Create Express app
var app = express();

// Set up view engine (Pug templates in 'views' folder)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(logger('dev')); // log HTTP requests
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: false })); // parse URL-encoded body
app.use(cookieParser()); // parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

// Route handling
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Export app (for use in bin/www)
module.exports = app;

// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/selfie', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
