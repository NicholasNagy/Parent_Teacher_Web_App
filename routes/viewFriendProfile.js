var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require ('./dbConfig');
var functions=require('./functions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();


router.post('/', function(req, res, next) {

    var userID = req.body.userID;
    var friendID = req.body.friendID;

    var groups = "SELECT groupID, groupName from groups where memberID='"+friendID+"';";
    var friends = "SELECT friendName,f2 FROM friends where f1='"+friendID+"';";
    var theSQL = "SELECT ID, Email, Pass, Fname, Lname, isTeacher from Users where ID='"+friendID+"';";
    //looking into the teachers table and return the results. If the result is there, then its length would be > 0.

    pool.connection.query(theSQL, function (err, result){
        if (err) throw err;
      pool.connection.query(groups, function (err, result2){
        if (err) throw err;
        pool.connection.query(friends, function (err, result3){
        if (err) throw err;
        var userType;
        //if searching in the parent table is succesful.
        if(result.length>0){
            console.log('entering the if condition');
            if(result[0].isTeacher==1)
              userType = 'teacher';
            else {
              userType = 'parent';
            }
            var teacherID = result[0].ID;
            var teacherFname = result[0].Fname;
            var teacherLname = result[0].Lname;
            var teacherEmail = result[0].Email;
            var teacherPass = result[0].Pass;

            let getUser = new Promise(function(resolve, reject){
              resolve(functions.getUser(userID));
            });
            getUser.then(function(user){
              res.render('friendProfile', {userType:userType, userID:user.ID, friendID:teacherID, friendName:teacherFname,name:user.Fname, userLname:teacherLname, userEmail:teacherEmail, userPass:teacherPass, groupList: result2, friendsList: result3});
            });
        }
        else{
            console.log("unsuccessful teacher search");

        };
    });
  });
});



});


module.exports = router;
