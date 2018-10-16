var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require ('./dbConfig');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();


router.post('/', function(req, res, next) {
    var userID = req.body.userID;

    //connenect to database
    var ParentSQL = "SELECT ParentID, Fname, Lname, Email, Pass from parents where ParentID='"+userID+"';";
    //var TeacherSQL = "SELECT TeacherID, Fname, Lname, Email, Pass from teachers where TeacherID='"+userID+"';";


    //look in the parents table and return the results. If the result is there, then its length would be > 0.
    pool.connection.query(ParentSQL, function (err, result){
        if (err) throw err;

        //if searching in the parent table is succesful.
        if(result.length>0){

            var userType = 'parent';
            var parentID = result[0].ParentID;
            var parentFname = result[0].Fname;
            var parentLname = result[0].Lname;
            var parentEmail = result[0].Email;
            var parentPass = result[0].Pass;

            res.render('profile', {userType:userType, userID:parentID, userFname:parentFname, userLname:parentLname, userEmail:parentEmail, userPass:parentPass});

        }
        else{
            console.log("unsuccessful parent search");
        };
    });


/*
     //look in the parents table and return the results. If the result is there, then its length would be > 0.
     pool.connection.query(TeacherSQL, function (err, result){
        if (err) throw err;

        //if searching in the parent table is succesful.
        if(result.length>0){

            var userType = 'teacher';
            var TeacherID = result[0].TeacherID;
            var TeacherFname = result[0].Fname;
            var TeacherLname = result[0].Lname;
            var TeacherEmail = result[0].Email;
            var TeacherPass = result[0].Pass;

            res.render('profile', {userType:userType, userID:TeacherID, userFname:TeacherFname, userLname:TeacherLname, userEmail:TeacherEmail, userPass:TeacherPass});

        }
        else{
            console.log("unsuccessful Teacher search");
        };

    });
*/




});


module.exports = router;
