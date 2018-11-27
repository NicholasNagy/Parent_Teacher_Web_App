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
  console.log("hello");
    var userID = req.body.userID;
    console.log(userID);

    var TeacherSQL = "SELECT ID, Email, Pass, Fname, Lname, isTeacher from Users where ID='"+userID+"';";
    //looking into the teachers table and return the results. If the result is there, then its length would be > 0.
    pool.connection.query(TeacherSQL, function (err, result){
        if (err) throw err;
        var userType;
        //if searching in the parent table is succesful.
        if(result.length>0) {
            console.log('entering the if condition');
            if (result[0].isTeacher == 1)
                userType = 'teacher';
            else {
                userType = 'parent';
            }
            var getPosts = "SELECT * FROM post join Users ON post.WallID='" + userID + "' AND post.WallID!=post.posterID AND post.posterID=Users.ID ORDER BY post.postID DESC;";
            pool.connection.query(getPosts, function (err, notifications) {
                if (err) throw err;

                var getMessenger = "SELECT * FROM thechats join Users ON thechats.receiverID='" + userID + "' AND thechats.senderID=Users.ID GROUP By senderID ORDER BY thechats.chatID DESC;";
                pool.connection.query(getMessenger, function (err, MessNotifications) {
                    if (err) throw err;

                    var teacherID = result[0].ID;
                    var teacherFname = result[0].Fname;
                    var teacherLname = result[0].Lname;
                    var teacherEmail = result[0].Email;
                    var teacherPass = result[0].Pass;

                    res.render('profile', {
                        userType: userType,
                        userID: teacherID,
                        name: teacherFname,
                        userLname: teacherLname,
                        userEmail: teacherEmail,
                        userPass: teacherPass,
                        notification: notifications,
                        messengerNotific:MessNotifications
                    });

                });
            });
        }

        else{
            console.log("unsuccessful teacher search");

        };
    });


});


module.exports = router;
