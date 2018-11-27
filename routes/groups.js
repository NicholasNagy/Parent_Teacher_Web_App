var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require ('./dbConfig');
var functions = require('./functions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();




router.post('/', function(req, res, next) {

    var userID = req.body.userID;

    var displayGroups = "SELECT groupName,groupID FROM groups where memberID='"+userID+"';";

    pool.connection.query(displayGroups, function (error, results) {
        if (error)
            throw error;

        // let getPostNotific= new Promise(function (resolve,reject) {
        //     resolve(functions.getPostNotifications(userID));
        // });
        // getPostNotific.then(function(postnotific){
        //     console.log("show me what you got "+postnotific);
        // });

        let getName = new Promise(function(resolve, reject){
          resolve(functions.getUser(userID));
        });
        getName.then(function(user) {
            var friendsList = "SELECT friendName,f2 FROM friends where f1='" + userID + "';";

            pool.connection.query(friendsList, function (error, results) {
                if (error)
                    throw error;
                var getPosts = "SELECT * FROM post join Users ON post.WallID='" + userID + "' AND post.WallID!=post.posterID AND post.posterID=Users.ID ORDER BY post.postID DESC;";
                pool.connection.query(getPosts, function (err, notifications) {
                    if (err) throw err;

                    var getMessenger = "SELECT * FROM thechats join Users ON thechats.receiverID='" + userID + "' AND thechats.senderID=Users.ID GROUP By senderID ORDER BY thechats.chatID DESC;";
                    pool.connection.query(getMessenger, function (err, MessNotifications) {
                        if (err) throw err;
                        res.render('groups', {groupList: results, uID: userID, name: user.Fname, notification: notifications, messengerNotific: MessNotifications});
                    });
                });
            });
        });
    });




});


module.exports = router;
