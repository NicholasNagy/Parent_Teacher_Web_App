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
    var gID = req.body.groupID;

  //Checking if the user is part of the group. 
  var groupStatus = "SELECT Fname,Lname,groupName,memberID,groupID FROM groups where memberID='"+userID+"' AND groupID='"+gID+"';";


    // Get group members
    var selectGroup = "SELECT Fname,Lname,groupName,memberID,groupID FROM groups where groupID='"+gID+"';";

    //Get pending requests 
    var selectRequests = "SELECT requesterID,Fname,Lname,groupID,leaderID FROM grouprequests where groupID='"+gID+"';";


pool.connection.query(selectRequests, function (error, requests) {
    if (error)throw error;
pool.connection.query(groupStatus, function (error, result) {
    if (error)throw error;
    pool.connection.query(selectGroup, function (error, results) {
        if (error)
            throw error;


            console.log(result[0])


        let getUser = new Promise(function(resolve, reject){
          resolve(functions.getUser(userID));
        });
        getUser.then(function(user){
          res.render('editGroup', {groupMembers : results, groupID : gID, uID : userID, groupName : results[0].groupName, name: user.Fname , leader: results[0], memberStatus: result[0], groupRequests : requests});
        });
    });
});
});
});

module.exports = router;
