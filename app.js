var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var parentRouter = require('./routes/parenthomepage');
var toCommentPageRouter = require('./routes/toCommentPage');
var replyRouter = require('./routes/reply')
var loginRouter=require('./routes/login');
var postRouter=require('./routes/posting');
var parentProfileRouter=require('./routes/parentProfile');
var teacherProfileRouter=require('./routes/teacherProfile');
var editParentProfileInfoRouter = require('./routes/editParentProfileInfo')
var messenger = require('./routes/Messengerindex');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/stylesheets', express.static('stylesheets'));
app.use('/routes',express.static(__dirname + '/routes'));
app.use('/node_modules',express.static(__dirname + '/socket.io/socket.io.js'));
app.use(express.static(path.join('public')))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/login',indexRouter);
app.use('/users', usersRouter);
app.use('/parenthomepage',parentRouter);
app.use('/commentPage', toCommentPageRouter);
app.use('/reply', replyRouter);
app.use('/login', loginRouter);
app.use('/posting',postRouter);
app.use('/parentProfile',parentProfileRouter);
app.use('/teacherProfile',teacherProfileRouter);
app.use('/editParentProfileInfo', editParentProfileInfoRouter);
app.use('/parentMessenger',messenger);
app.use('/logout',indexRouter);
app.use('/homepage',indexRouter);



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
var server = app.listen(3001, function(){
console.log("Started on port 3001");
});

var io = require('socket.io').listen(server);
module.exports.servers= server;
module.exports = app;
