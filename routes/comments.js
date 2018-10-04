var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var connection = mysql.createConnection({

    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'b2af4a2e0e0550',
    password: '6424a2d3',
    database: 'heroku_1f20bf2d1e8055d'
});

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
  var commentsql= "SELECT Content FROM Comments where PostID='"+thepost+"';";
  //SQL QUERY HERE
  connection.query(sql, function (err, result){
    if (err) throw err;
    //ANOTHER SQL QUERY HERE
    connection.query(commentsql, function(error,results){
      if(error) throw error;
      //console.log(result[0].Content);
      //RENDERING THE PAGE WITH THE CONTENT
      res.render('comments', {post: result[0].Content, comments: results});

    })
  });






});

module.exports=router;
