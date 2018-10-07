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
//HANDLING POSTING COMMENTS HERE
router.post('/', function(req,res,next){
  //GETTING POSTID HERE
  var thepost = req.body.postID;
  console.log(thepost);
//CREATING SQL STATEMENTS
  var sql = "SELECT Content FROM posts where PostID='"+thepost+"';";
  var commentsql= "SELECT Content FROM comments where PostID='"+thepost+"';";
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
