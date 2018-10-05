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
 } else {                                      
   throw err;                                  
 }
});
}

handleDisconnect();

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});


//Getting the Post and rendering comment screen
router.post('/', function(req,res,next){
  //GETTING POSTID HERE
  var postID = req.body.postID;

  console.log(postID);
//CREATING SQL STATEMENTS
  var post = "SELECT Content FROM posts where PostID='"+postID+"';";
  var comments = "SELECT Content FROM comments where PostID='"+postID+"';";
  
  //SQL QUERY HERE

  connection.query(post, function (err, resultP){
    if (err) throw err;
  connection.query(comments, function (err, result){
    if (err) throw err;
    
      //RENDERING THE PAGE WITH THE CONTENT
      res.render('comments', {comments : result, postID, post: resultP[0].Content});

  })
});
});











module.exports=router;
