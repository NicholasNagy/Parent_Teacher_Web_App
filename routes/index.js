var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connects to heroku online database
var connection = mysql.createConnection({

    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'b2af4a2e0e0550',
    password: '6424a2d3',
    database: 'heroku_1f20bf2d1e8055d'
});
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//signup for parents
router.post('/signup', function(req,res){
  //initializing variables
  var fName=req.body.firstName;
  var lName=req.body.lastName;
  var ChildID=req.body.childID;
  var Email=req.body.email;
  var pass = req.body.password;

  
//creating queries, first one checks to see if there are any emails that
//are the same the second inserts the data into the database
  var query = "SELECT Email FROM Parents where Email='"+ Email+"';";
  var sql = "INSERT INTO  Parents (Fname, Lname, Email, ChildID, Pass) VALUES ('"+fName+"','"+lName+"', '"+Email+"', '"+ChildID+"', '"+pass+"')";

 //connecting to sql database to use the query
 connection.connect(function(err){
    if(err) console.log(err.stack);
    console.log("Connected!");

    //below the query checks to see if any of the same emails exist
    //if they do, the method ends
    connection.query(query, function(err, result){
      if(err) throw err;
    if(Email==result[0].Email){//checks to see if any results with the same email
                              //turned up
      console.log("email is already in use");
      res.end();
    }
    else{
      //if none were found, data is inserted into database
      connection.query(sql, function (err, result){
        if (err) throw err;
        console.log("Result: " + result);
        //below the homepage is rendered
        res.render('parenthomepage', { title: 'Express' });
      });
    }
  })
});
  /*
  //signup for teachers
  //assigning variable names
  var fName=req.body.;
  var lName=req.body.;
  var ClassID=req.body.;
  var Email=req.body.;
  var pass = req.body.;

//making sql queries, the first one is used for checking emails, the second
//for signup
  var query = "SELECT Email FROM Teachers where Email='"+ Email+"';";
  var sql = "INSERT INTO  Teachers (Fname, Lname, Email, ClassID, Pass) VALUES ('"+fName+"','"+lName+"', '"+Email+"', '"+ClassID+"', '"+pass+"')";

//connection for sql querying
  connection.connect(function(err){
     if(err) console.log(err.stack);
     console.log("Connected!");

     //making the first sql query to check for any of the same email in the
     //database
     connection.query(query, function(err, result){
       if(err) throw err;
     if(Email==result[0].Email){//checks to see if the result of the query
                                //had any results
       console.log("email is already in use");//if it did, email is in use
       res.end();
     }
     else{
       //else the insertion query is performed, and homepage rendered
       connection.query(sql, function (err, result){
         if (err) throw err;
         console.log("Result: " + result);
         res.render('parenthomepage', { title: 'Express' });
       });
     }
   })

 });*/




});
//signup for teachers
router.post('',function(req,res){

})

router.post('/login', function(req,res){
  //initializing the variables
  var email=req.body.email_logIn;
  var pass = req.body.password_logIn;

  //make querying statements, first one searches through the Parents table for
  //the same email and password, while the other searches through the teachers table
  var sql = "SELECT Email, Pass from Parents where Email='"+email+"' and Pass='"+pass+"';";
  var thesql= "SELECT Email, Pass from Teachers where Email='"+email+"' and Pass='"+pass+"';";

  //connecting to mysql database for querying
  connection.connect(function(err){
    if(err) console.log(err.stack);
    console.log("Connected!");

    //below checks the query for the same email and password
    connection.query(sql, function (err, result){
      if (err) throw err;
      //underneath is the boolean for it
      if(result[0].Email==email&&result[0].Pass==pass){
        console.log("Login Successful");
        //if successful, renders homepage
        res.render('parenthomepage', {title: 'Express'});
      }

    });
    //below checks the query for the same email and password
    connection.query(thesql, function err, result){
      if(err) throw err;
      //underneath is the boolean for it
      if(result[0].Email==email&&result[0].Pass==pass){
        console.log("Login Successful");
        //if successful, renders homepage
        res.render('parenthomepage', {title: 'Express'});
      }
    }
  });

})




module.exports = router;
