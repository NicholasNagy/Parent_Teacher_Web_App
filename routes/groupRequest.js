var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var functions = require('./functions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();


router.post('/', function(req, res, next) {


  var userID = req.body.logID;
  var gID = req.body.groupID;
  var leaderID = req.body.leaderID;

var userToAdd = "SELECT Fname,Lname,ID FROM users where ID='"+userID+"';";
var groupStatus = "SELECT Fname,Lname,groupName,memberID,groupID FROM groups where memberID='"+userID+"' AND groupID='"+gID+"';";
var selectGroup = "SELECT Fname,Lname,groupName,memberID,groupID FROM groups where groupID='"+gID+"';";
var selectRequests = "SELECT requesterID,Fname,Lname,groupID,leaderID FROM grouprequests where groupID='"+gID+"';";

 pool.connection.query(groupStatus, function (error, results1) {
  if (error)throw error;
  pool.connection.query(selectGroup, function (error, results2) {
      if (error)
          throw error;
    pool.connection.query(userToAdd, function (error, result) {
         if (error)throw error;
        

  var userFname = result[0].Fname;
  var userLname = result[0].Lname;
 


 // Get group members
 var addRequest = "INSERT INTO  grouprequests (requesterID,Fname,Lname, groupID, leaderID) VALUES ('"+userID+"','"+userFname+"','"+userLname+"','"+gID+"','"+leaderID+"')";

        pool.connection.query(addRequest, function (error, results) {
            if (error)
               throw error;
                pool.connection.query(selectRequests, function (error, requests) {
                  if (error)throw error;

          let getUser = new Promise(function(resolve, reject){
            resolve(functions.getUser(userID));
          });
          getUser.then(function(user){
          res.render('editGroup', {groupMembers : results2, groupID : gID, uID : userID, groupName : results2[0].groupName, name: user.Fname , leader: results2[0], memberStatus: results1[0], groupRequests : requests});
          });
        });
      });
    });
  });
 });
});

module.exports=router;
