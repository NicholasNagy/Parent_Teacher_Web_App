var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');

var connection = mysql.createConnection({

    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'b2af4a2e0e0550',
    password: '6424a2d3',
    database: 'heroku_1f20bf2d1e8055d'
});

//Accessing mysql DataBase
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    // var sql = "INSERT INTO login (username, password) VALUES ('Jaihon', '123456')";
    // connection.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log("1 record inserted");
    // });
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var parentRouter = require('./routes/parenthomepage');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/stylesheets', express.static('stylesheets'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/parenthomepage',parentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

//hosting the webpage on port 3000 of the local host
app.listen(3000, function(){
console.log("Started on port 3000");
});

module.exports = app;
