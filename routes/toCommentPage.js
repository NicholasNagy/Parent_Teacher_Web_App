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


//Getting the Post and rendering comment screen
router.post('/', function(req,res,next){
  //GETTING POSTID HERE
  var postID = req.body.postID;
  var userName = req.body.userName;
  var userID = req.body.userID
  let getComments = new Promise(function(resolve, reject){
    resolve(functions.generateComments(postID, userName, userID));
  });
  getComments.then(function(stuff){
    res.render('comments', stuff);
  });

});











module.exports=router;
