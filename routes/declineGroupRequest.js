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


router.post('/', function (req,res) {
  //GET ids.
    var loggedInID = req.body.logID;
    var memberID = req.body.idToAdd;
    var gID = req.body.groupID;
    var gName = req.body.groupName;


    var sql = "SELECT Fname,Lname FROM users where ID='"+memberID+"';";

pool.connection.query(sql, function (err, result){
      if (err) throw err;

      memberFname = result[0].Fname;
      memberLname = result[0].Lname;

//Getting the members list
var selectMembers = "SELECT Fname,Lname,groupName,memberID FROM groups where groupID='"+gID+"';";

//Handling requests 
var groupStatus = "SELECT Fname,Lname,groupName,memberID,groupID FROM groups where memberID='"+loggedInID+"' AND groupID='"+gID+"';";
var selectRequests = "SELECT requesterID,Fname,Lname,groupID,leaderID FROM grouprequests where groupID='"+gID+"';";
var removeRequest = "DELETE FROM grouprequests where requesterID='"+memberID+"';";

  pool.connection.query(removeRequest, function (error, del) {
      pool.connection.query(selectRequests, function (error, requests) {
          pool.connection.query(groupStatus, function (error, results1) {
              if (error) throw error;
              pool.connection.query(selectMembers, function (error, results) {
                if (error) throw error;

              let getUser = new Promise(function(resolve, reject){
                resolve(functions.getUser(loggedInID));
              });
              getUser.then(function(user){
                res.render('editGroup', {groupMembers : results, groupID : gID, uID : loggedInID, groupName : results[0].groupName, name: user.Fname , leader: results[0], memberStatus: results1[0], groupRequests : requests});
                  });
                });
            });
          });
    });
});
});

module.exports=router;
