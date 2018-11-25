var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var functions = require('./functions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();


router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

//Handeling comments
router.post('/', function(req,res,next){
  //GETTING POSTID HERE
  var comment = req.body.replayArea;
  var postID = req.body.postID;
  var userID = req.body.userID;
  var userName = req.body.userName;

  var tagged1 = req.body.taggedFriend0;
  var tagged2 = req.body.taggedFriend1;
  var tagged3 = req.body.taggedFriend2;
  var tagged4 = req.body.taggedFriend3;
  var tagged5 = req.body.taggedFriend4;

  let theComment = new Promise(function(resolve, reject){
    resolve(functions.comment(comment, postID, userID, tagged1, tagged2, tagged3, tagged4, tagged5));
  });
  theComment.then(function(successMessage){
    let getComments = new Promise(function(resolve, reject){
      resolve(functions.generateComments(postID, userName, userID));
    });
    getComments.then(function(stuff){
      res.render('comments', stuff);
    });
  });

});











module.exports=router;
