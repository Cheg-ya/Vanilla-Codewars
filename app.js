var express = require('express');
var path = require('path');
var index = require('./routes/index');
var problems = require('./routes/problems');

var app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/', index); // origin
app.use('/problems', problems);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  debugger
  var err = new Error('Not Found');
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
