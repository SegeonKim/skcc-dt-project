var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');

var app = express();
var port = process.env.PORT || 8080;

var mongoose = require('mongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
 secret: 'rmformfo',
 resave: false,
 saveUninitialized: true
}));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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

var db = mongoose.connection;

mongoose.connect('mongodb://segeon:segeon@localhost:27017/dt', function(err) {
    if (err) {
        console.error('mongodb connection error', err);
    }
    console.log('mongodb connected');
});

var server = app.listen(port, function(){
 console.log("Express server has started on port", port);
});

module.exports = app;
