var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var update = require('./functions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();


router.post('/', function(req,res, next){
  var postID = req.body.postID;
  var wallID = req.body.WallID;
  var userID = req.body.userID;
  var Fname = req.body.name;


  var like = "UPDATE post SET likes = likes+1 WHERE postID = "+postID+";";

  pool.connection.query(like,function(err, result){
    if(err) throw err;
      let newposts = new Promise(function(resolve, reject){
        resolve(update.getWall(wallID, userID));
      });
      newposts.then(function(wall){
        res.render('parenthomepage', wall);
      });
  });

});





module.exports = router;
