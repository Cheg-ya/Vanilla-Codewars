const express = require('express');
const path = require('path');
const index = require('./routes/index');
const problems = require('./routes/problems');
const mongoose = require('mongoose');

mongoose.connect('mongodb://admin_song:123123123@cluster0-shard-00-00-4hrjv.mongodb.net:27017,cluster0-shard-00-01-4hrjv.mongodb.net:27017,cluster0-shard-00-02-4hrjv.mongodb.net:27017/vanilla-codewars?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
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
