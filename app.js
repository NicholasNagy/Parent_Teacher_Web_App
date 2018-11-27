var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');


/* this done to route the js file*/
var forgotPasswordRouter= require('./routes/forgotPassword');

var indexRouter = require('./routes/index');

var toCommentPageRouter = require('./routes/toCommentPage');
var replyRouter = require('./routes/reply')
var loginRouter=require('./routes/login');
var postRouter=require('./routes/posting');

var friendProfileRouter = require('./routes/viewFriendProfile');
var editParentProfileInfoRouter = require('./routes/editParentProfileInfo');
var messenger = require('./routes/Messengerindex');

var friendsRouter = require('./routes/friends');
var searchFriendsRouter = require('./routes/searchFriends');
var searchUsersRouter = require('./routes/searchUsers');
var addFriendsRouter = require('./routes/addFriends');
var viewProfile = require('./routes/viewProfile');
var groupsRouter = require('./routes/groups');
var createGroupRouter = require('./routes/createGroups');
var editGroupRouter = require('./routes/editGroup');
var addtoGroupRouter = require('./routes/addToGroup');
var groupRequestRouter = require('./routes/groupRequest');
var declineGroupRequestRouter = require('./routes/declineGroupRequest');

var wallRouter = require('./routes/goToWall');

//viewing profile
var viewProfile = require('./routes/viewProfile');

//like/dislike routers

var likeRouter = require('./routes/like');
var dislikeRouter = require('./routes/dislike');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/stylesheets', express.static('stylesheets'));
app.use('/routes',express.static(__dirname + '/routes'));
app.use('/node_modules',express.static(__dirname + '/socket.io/socket.io.js'));
app.use(express.static(path.join('public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use( express.static( "public" ) );
app.use( express.static( "public/uploads" ) );



app.use('/', indexRouter);
//app.use('/login',indexRouter);


app.use('/commentPage', toCommentPageRouter);
app.use('/reply', replyRouter);
app.use('/login', loginRouter);
app.use('/posting',postRouter);

app.use('/editParentProfileInfo', editParentProfileInfoRouter);
app.use('/parentMessenger',messenger);
app.use('/logout',indexRouter);
app.use('/homepage',indexRouter);

app.use('/viewFriendProfile', friendProfileRouter);

//friends
app.use('/friends', friendsRouter);
app.use('/searchFriends',searchFriendsRouter);
app.use('/searchUsers',searchUsersRouter);
app.use('/addFriends', addFriendsRouter);
app.use('/viewProfile', viewProfile);
app.use('/goToWall', wallRouter);

//like/dislike routers
app.use('/like', likeRouter);
app.use('/dislike', dislikeRouter);

//view profile
app.use('/viewProfile', viewProfile);

//groups
app.use('/groups',groupsRouter);
app.use('/createGroups',createGroupRouter);
app.use('/editGroup',editGroupRouter);
app.use('/addToGroup',addtoGroupRouter);
app.use('/groupRequest', groupRequestRouter);
app.use('/declineGroupRequest', declineGroupRequestRouter);



/* to link the js*/
app.use('/forgotPassword',forgotPasswordRouter);





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
