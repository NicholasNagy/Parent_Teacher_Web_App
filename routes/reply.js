var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require('./dbConfig');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();

/*var connection;

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

handleDisconnect();*/

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

//Handeling comments
router.post('/', function(req,res,next){
  //GETTING POSTID HERE
  var comment = req.body.replayArea;
  var postID = req.body.postID;
  console.log(postID);
  var postSQL = "INSERT INTO comments (Content, PostID) VALUES ('"+comment+"', '"+postID +"');";// !Should add fields for unique IDs !
  pool.connection.query(postSQL, function (err, result) {
    if (err)
        throw err;
    console.log("Comment is added to DB");//NOTIFYING OF ADDITION ON CONSOLE

    //NEW SELECT STATEMENT TO DISPLAY THE PROPER POSTS FOR THE INDIVIDUAL
    // ! Should select from unique ID !
    var comments = "SELECT Content FROM comments where PostID='"+postID+"';";
    var post = "SELECT Content FROM posts where PostID='"+postID+"';";
    //EXECUTION OF QUERY
    pool.connection.query(post, function (error, resultP) {
    pool.connection.query(comments, function (error, results) {
        if (error)
            throw error;
          //RENDERING HOMEPAGE AFTER POSTING HAS BEEN DONE
        res.render('comments', {post: resultP[0].Content, comments: results, postID});
    })
  });

});
});











module.exports=router;
