var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');

var db_config = {
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'b2af4a2e0e0550',
    password: '6424a2d3',
    database: 'heroku_1f20bf2d1e8055d'
};

var connection;

//code to stop disconnecting is from https://stackoverflow.com/questions/20210522/nodejs-mysql-error-connection-lost-the-server-closed-the-connection

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since the old one cannot be reused.
                                                  

  connection.connect(function(err) {              // The server is either down or restarting.
    if(err) {                                     
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);             // We introduce a delay before attempting to reconnect,to avoid a hot loop, and to allow our node script to
    }                                                   
  });                                               // process asynchronous requests in the meantime.
                                                    // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually lost due to either server restart, or a connnection idle timeout (the wait_timeout server variable configures this)
      handleDisconnect();                         
    }
    else if(err.code === 'ETIMEDOUT'){
      handleDisconnect();
    }
    else {                                      
      throw err;                                  
    }
  });
}

handleDisconnect();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var parentRouter = require('./routes/parenthomepage');
var toCommentPageRouter = require('./routes/toCommentPage');
var replyRouter = require('./routes/reply')
var loginRouter=require('./routes/login');
var postRouter=require('./routes/posting');
var parentProfileRouter=require('./routes/parentProfile');
var teacherProfileRouter=require('./routes/teacherProfile');


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
//app.use('/login',indexRouter);
app.use('/users', usersRouter);
app.use('/parenthomepage',parentRouter);
app.use('/commentPage', toCommentPageRouter);
app.use('/reply', replyRouter);
app.use('/login', loginRouter);
app.use('/posting',postRouter);
app.use('/parentProfile',parentProfileRouter);
app.use('/teacherProfile',teacherProfileRouter);




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
app.listen(3001, function(){
console.log("Started on port 3001");
});

module.exports = app;
