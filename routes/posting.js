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
    connection.query(postSQL, function (err, result) {
        if (err)
            throw err;
        console.log("Post is added to DB");//NOTIFYING OF ADDITION ON CONSOLE

        //NEW SELECT STATEMENT TO DISPLAY THE PROPER POSTS FOR THE INDIVIDUAL
        var posts = "SELECT Content, PostID FROM posts where ClassID='"+ClassID+"';";
        //EXECUTION OF QUERY
        connection.query(posts, function (error, results) {
            if (error)
                throw error;
              //RENDERING HOMEPAGE AFTER POSTING HAS BEEN DONE
            res.render('parenthomepage', {posts: results, name:theName, classID:ClassID, teacherID:TeacherID});
        });


    });
});

module.exports=router;
