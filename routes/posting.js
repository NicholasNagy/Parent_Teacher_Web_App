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

//HANDLE POSTING HERE
router.post('/', function (req,res) {
  //GET ALL VARIABLE SUBMITTED
    var post = req.body.textPost;
    var ClassID= req.body.classID;
    var TeacherID= req.body.teacherID;
    var theName= req.body.name;
    //CREATING SQL METHOD
    var postSQL = "INSERT INTO posts (content, ClassID, TeacherID, TheDate) VALUES ('"+post+"', '"+ClassID +"', '"+TeacherID+"', NOW());";
    //INSERTING THE NEW POST
    pool.connection.query(postSQL, function (err, result) {
        if (err)
            throw err;
        console.log("Post is added to DB");//NOTIFYING OF ADDITION ON CONSOLE

        //NEW SELECT STATEMENT TO DISPLAY THE PROPER POSTS FOR THE INDIVIDUAL
        var posts = "SELECT Content, PostID FROM posts where ClassID='"+ClassID+"';";
        //EXECUTION OF QUERY
        pool.connection.query(posts, function (error, results) {
            if (error)
                throw error;
              //RENDERING HOMEPAGE AFTER POSTING HAS BEEN DONE
            res.render('parenthomepage', {posts: results, name:theName, classID:ClassID, teacherID:TeacherID});
        });


    });
});

module.exports=router;
