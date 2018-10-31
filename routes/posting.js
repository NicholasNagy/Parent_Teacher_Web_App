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

//HANDLE POSTING HERE
router.post('/', function (req,res) {
  //GET ALL VARIABLE SUBMITTED
    var post = req.body.textPost;
    var WallID= req.body.WallID;
    var PosterID= req.body.PosterID;
    var theName= req.body.name;

    let thepost = new Promise(function(resolve, reject){
      resolve(functions.post(post, WallID, PosterID));
    });

    thepost.then(function(successMessage){
      console.log(successMessage);
      //NEW SELECT STATEMENT TO DISPLAY THE PROPER POSTS FOR THE INDIVIDUAL
      var posts = "SELECT * FROM post where WallID='"+WallID+"';";
      //EXECUTION OF QUERY
      pool.connection.query(posts, function (error, results) {
          if (error)
              throw error;
            //RENDERING HOMEPAGE AFTER POSTING HAS BEEN DONE
          res.render('parenthomepage', {posts: results, name:theName, WallID:WallID, userID:PosterID});
      });
    });


});

module.exports=router;
