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

handleDisconnect(); */
/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});



router.post('/signup', function(req,res){
  var isTeacher;
    if(req.body.account==="parent"){
      isTeacher = 0;
    }
    else {
      isTeacher = 1;
    }

        //initializing variables
        var fName=req.body.firstName;
        var lName=req.body.lastName;
        var Email=req.body.email;
        var pass = req.body.password;



        //creating queries, first one checks to see if there are any emails that
        //are the same the second inserts the data into the database
        var query = "SELECT Email FROM Users where Email='"+ Email+"';";
        var sql = "INSERT INTO  Users (Fname, Lname, Email, Pass, isTeacher) VALUES ('"+fName+"','"+lName+"', '"+Email+"', '"+pass+"','"+isTeacher+"')";

        //connecting to sql database to use the query
       -

            //below the query checks to see if any of the same emails exist
            //if they do, the method ends
            pool.connection.query(query, function(err, result){
                if(err) throw err;

                if(result.length>0){//checks to see if any results with the same email
                    //turned up
                    console.log("email is already in use: " + result[0].Email);
                    //HANDLE EMAIL ALREADY IN USE CASE HERE
                    res.send("email is already in use");
                    //res.render('index',{title:'express'});
                }
                else{
                    //if none were found, data is inserted into database
                    pool.connection.query(sql, function (err, results){
                        if (err) throw err;
                        console.log("Result: " + results);
                        //below the homepage is rendered
                        //HANDLE BEING SENT TO HOMEPAGE HERE
                        res.send("signup successful");


                    });
                }
            });


});








module.exports = router;
