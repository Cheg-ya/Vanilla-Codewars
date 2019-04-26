const express = require('express');
const path = require('path');
const index = require('./routes/index');
const problems = require('./routes/problems');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://guest:123123123@cluster0-4hrjv.mongodb.net/vanilla-codewars', { useNewUrlParser: true });

const db = mongoose.connection;

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/problems', problems);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
