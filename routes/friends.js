var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require ('./dbConfig');
var friends = require('./friendsObject');
var notifications = require('./functions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();




router.post('/', function(req, res, next) {

    var userID = req.body.userID;
    var userName = req.body.userName;


    var getFriendsPage = new Promise(function(resolve, reject){
      resolve(friends.getFriendsPage(userID));
    });
    getFriendsPage.then(function(friendPage){
console.log(friendPage.friendsList);

                res.render('friends', {friendsList:friendPage.friendsList, userID: userID, name: userName, notification:friendPage.notification, messengerNotific:friendPage.messengerNotific});
          });












});


module.exports = router;
