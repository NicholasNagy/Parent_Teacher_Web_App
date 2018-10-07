var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

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

router.post('/', function(req,res){
    //initializing the variables
    var email=req.body.email_logIn;
    var pass = req.body.password_logIn;

    //make querying statements, first one searches through the Parents table for
    //the same email and password, while the other searches through the teachers table
    var sql = "SELECT Email, Pass, Fname from parents where Email='"+email+"' and Pass='"+pass+"';";
    var thesql= "SELECT Email, Pass, teacherID, ClassID, Fname from teachers where Email='"+email+"' and Pass='"+pass+"';";

    var x =0;

        //below checks the query for the same email and password
        connection.query(sql, function (err, result){
            if (err) throw err;
            //underneath is the boolean for it
            if(result.length>0){
                if(result[0].Email==email&&result[0].Pass==pass){
                    console.log("Login Successful");
                    var posts = "SELECT Content, PostID FROM posts";
                    connection.query(posts, function (error, results) {
                        if (error)
                            throw error;

                        var thename=result[0].Fname;
                        res.render('homepage', {posts: results, name:thename});
                        // router.post('/commentPage',function(req,res){
                        //   res.render('comments', {posts: results})

                          //handle comment page
                        //});
                        });
                }
            }

            else{
                console.log("unsuccessful parent login");
                x=x+1;
                console.log(x);
            };

        });

        //below checks the query for the same email and password
        connection.query(thesql, function (err, result){
            if(err) throw err;
            //underneath is the boolean for it


            if(result.length>0){
              var ClassID = result[0].ClassID;
              var TeacherID = result[0].TeacherID;
              var theName= result[0].Fname;
                if(result[0].Email==email&&result[0].Pass==pass){
                    console.log("Teacher Login Successful");
                    //if successful, renders homepage
                    //HANDLE BEING SENT TO HOMEPAGE HERE
                    var posts = "SELECT Content, PostID FROM posts where ClassID='"+ClassID+"';";
                    connection.query(posts, function (error, results) {
                        if (error)
                            throw error;
                        if(results==0){//handles case where teacher hasn't posted anything yet
                          var allposts = "SELECT Content, PostID FROM posts";
                          connection.query(allposts, function (error, results) {
                              if (error)
                                  throw error;
                              res.render('parenthomepage', {posts: results, name:theName, classID:ClassID, teacherID:TeacherID});
                          });
                        }
                        else{
                          res.render('parenthomepage', {posts: results, name:theName, classID:ClassID, teacherID:TeacherID});

                        }
                    });


                }
            }
            else{
                console.log("unsuccessful teacher login");
                //res.end("Incorrect login information, please try again");

            }
    });
 
});




module.exports=router;
