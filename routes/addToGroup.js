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

//Getting the user the user wants to add to the group.
    var groupADD = "SELECT Fname,Lname FROM users where ID='"+memberID+"';";

pool.connection.query(groupADD, function (err, result){
      if (err) throw err;

      memberFname = result[0].Fname;
      memberLname = result[0].Lname;


  //Adding the new member
  var addToTable = "INSERT INTO  groups (memberID,Fname,Lname,groupName, groupID) VALUES ('"+memberID+"','"+memberFname+"','"+memberLname+"','"+gName+"','"+gID+"')";

    pool.connection.query(addToTable, function (error, resultc) {
      if (error)
          throw error;

//Getting the members list
var selectMembers = "SELECT Fname,Lname,groupName,memberID FROM groups where groupID='"+gID+"';";

            pool.connection.query(selectMembers, function (error, results) {
              if (error)
                 throw error;

              let getUser = new Promise(function(resolve, reject){
                resolve(functions.getUser(loggedInID));
              });
              getUser.then(function(user){
                res.render('editGroup', {groupMembers: results,uID : loggedInID, groupID : gID, groupName : results[0].groupName, name:user.Fname});
              });
              });


      });

});
});

module.exports=router;
