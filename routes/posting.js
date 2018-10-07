var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var db_config = {
    host: 'mysql-pnt-db.clokmnut66x8.us-east-1.rds.amazonaws.com',
    user: 'makchamp',
    password: 'Khanman69',
    database: 'heroku_1f20bf2d1e8055d'
};

var connection;

function handleDisconnect() {
 connection = mysql.createConnection(db_config); 
                                                 

 connection.connect(function(err) {              
   if(err) {                                     
     console.log('error when connecting to db:', err);
     setTimeout(handleDisconnect, 2000);             
   }                                                   
 });                                               
                                                  
 connection.on('error', function(err) {
   console.log('db error', err);
   if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
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
