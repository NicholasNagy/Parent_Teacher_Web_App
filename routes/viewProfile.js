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
    console.log(userID);

    //connenect to database
    //var ParentSQL = "SELECT ParentID, Fname, Lname, Email, Pass from parents where ParentID='"+userID+"';";
    //var TeacherSQL = "SELECT TeacherID, Fname, Lname, Email, Pass from teachers where TeacherID='"+userID+"';";
     //var test1= "SELECT TeacherID,Fname,Lname,Email,Pass,ClassID from teachers where Lname='"+last+"' and Fname='"+first+"';";
    var TeacherSQL = "SELECT ID, Email, Pass, Fname, Lname, isTeacher from Users where  isTeacher='"+1+"' and ID='"+userID+"';";
    //looking into the teachers table and return the results. If the result is there, then its length would be > 0.
    pool.connection.query(TeacherSQL, function (err, result){
        if (err) throw err;

        //if searching in the parent table is succesful.
        if(result.length>0){
            console.log('entering the if condition');
            var userType = 'teacher';
            var teacherID = result[0].ID;
            var teacherFname = result[0].Fname;
            var teacherLname = result[0].Lname;
            var teacherEmail = result[0].Email;
            var teacherPass = result[0].Pass;

            res.render('profile', {userType:userType, userID:teacherID, userFname:teacherFname, userLname:teacherLname, userEmail:teacherEmail, userPass:teacherPass});

        }
        else{
            console.log("unsuccessful teacher search");

        };
    });





});


module.exports = router;
