var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require('./dbConfig');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});



//signup for parents
router.post('/signup', function(req,res){
    if(req.body.account==="parent"){
        //initializing variables
        var fName=req.body.firstName;
        var lName=req.body.lastName;
        var ChildID=req.body.childID;
        var Email=req.body.email;
        var pass = req.body.password;


        //creating queries, first one checks to see if there are any emails that
        //are the same the second inserts the data into the database
        var query = "SELECT Email FROM parents where Email='"+ Email+"';";
        var sql = "INSERT INTO  parents (Fname, Lname, Email, ChildID, Pass) VALUES ('"+fName+"','"+lName+"', '"+Email+"', '"+ChildID+"', '"+pass+"')";

        //connecting to sql database to use the query
       -

            //below the query checks to see if any of the same emails exist
            //if they do, the method ends
            pool.connection.query(query, function(err, result){
                if(err) throw err;

                if(result.length>0){//checks to see if any results with the same email
                    //turned up
                    console.log("email is already in use");
                    //HANDLE EMAIL ALREADY IN USE CASE HERE
                    res.send("email is already in use");
                    //res.render('index',{title:'express'});
                }
                else{
                    //if none were found, data is inserted into database
                    pool.connection.query(sql, function (err, result){
                        if (err) throw err;
                        console.log("Result: " + result);
                        //below the homepage is rendered
                        //HANDLE BEING SENT TO HOMEPAGE HERE
                        res.send("signup successful");


                    });
                }
            });
    }
    else{
        //signup for teachers
        //assigning variable names
        var fName=req.body.firstName;
        var lName=req.body.lastName;
        var ClassID=req.body.classID;
        var Email=req.body.email;
        var pass = req.body.password;

        //making sql queries, the first one is used for checking emails, the second
        //for signup
        var query = "SELECT Email FROM teachers where Email='"+ Email+"';";
        var sql = "INSERT INTO  teachers (Fname, Lname, Email, ClassID, Pass) VALUES ('"+fName+"','"+lName+"', '"+Email+"', '"+ClassID+"', '"+pass+"')";

            //making the first sql query to check for any of the same email in the
            //database
            pool.connection.query(query, function(err, result){
                if(err) throw err;
                if(result.length>0){//checks to see if the result of the query
                    //had any results
                    console.log("email is already in use");//if it did, email is in use
                    //HANDLE EMAIL ALREADY IN USE HERE
                    res.send("email is already in use");
                }
                else{
                    //else the insertion query is performed, and homepage rendered
                    pool.connection.query(sql, function (err, result){
                        if (err) throw err;
                        console.log("Result: " + result);
                        //HANDLE BEING SENT TO HOMEPAGE HERE
                        res.send("successful signup");
                    });
                }
            });
    };


});








module.exports = router;
