var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require('./dbConfig');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});
//HANDLING POSTING COMMENTS HERE
router.post('/', function(req,res,next){
  //GETTING POSTID HERE
  var thepost = req.body.postID;
  console.log(thepost);
//CREATING SQL STATEMENTS
  var sql = "SELECT Content FROM posts where PostID='"+thepost+"';";
  var commentsql= "SELECT Content FROM comments where PostID='"+thepost+"';";
  //SQL QUERY HERE
  pool.connection.query(sql, function (err, result){
    if (err) throw err;
    //ANOTHER SQL QUERY HERE
    pool.connection.query(commentsql, function(error,results){
      if(error) throw error;
      //console.log(result[0].Content);
      //RENDERING THE PAGE WITH THE CONTENT
      res.render('comments', {post: result[0].Content, comments: results});

    })
  });






});

module.exports=router;
