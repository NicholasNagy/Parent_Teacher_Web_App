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
    var userName = req.body.userName;

    var friendList1 = "SELECT f2,friendName,f1Name FROM friends where f1='"+userID+"';";
    var friendList2 = "SELECT f1,f1Name,friendName FROM friends where f2='"+userID+"';";
    

    pool.connection.query(friendList1, function (error, results1) {
        if (error) throw error;
        pool.connection.query(friendList2, function (error, results2) {
          if (error) throw error;

            
          fullList =  results1.concat(results2);
  
        var getPosts = "SELECT * FROM post join Users ON post.WallID='" + userID + "' AND post.WallID!=post.posterID AND post.posterID=Users.ID ORDER BY post.postID DESC;";
        pool.connection.query(getPosts, function (err, notifications) {
            if (err) throw err;

            var getMessenger = "SELECT * FROM thechats join Users ON thechats.receiverID='" + userID + "' AND thechats.senderID=Users.ID GROUP By senderID ORDER BY thechats.chatID DESC;";
            pool.connection.query(getMessenger, function (err, MessNotifications) {
                if (err) throw err;


                res.render('friends', {friendsList: fullList, userID: userID, name: userName, notification: notifications, messengerNotific:MessNotifications});

            });
        });
    });
});


});


module.exports = router;
