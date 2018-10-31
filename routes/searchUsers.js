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


//HANDLE Search HERE
router.post('/', function (req,res) {
  //GET User query
    var queryName = req.body.searchField;
    var loggedInID = req.body.logID;
    var nameG = req.body.groupName;
    var gID =req.body.groupID;

    var query = "SELECT Fname,Lname,ID FROM users";

   var memberList = "SELECT Fname,Lname FROM users where ID='"+loggedInID+"';";

   var selectGroup = "SELECT Fname,Lname,groupName,memberID FROM groups where groupID='"+gID+"';";

pool.connection.query(selectGroup, function (error, result1) {   
pool.connection.query(memberList, function (error, result){
    pool.connection.query(query, function (error, results) {
      if (error)
          throw error;

          var users=[];
          var ids=[];
      

          for(var i =0; i < results.length; i++){

            var fullName = results[i].Fname + " " + (results[i].Lname);
            
            
            
            
            if( (results[i].Fname == queryName) || (results[i].Lname == queryName) || (fullName == queryName)  ){


            
             users.push(fullName);
             console.log(results[i].ID);
             ids.push(results[i].ID)
           
    
            }
          }

          if(users.length == 0 ){
            users.push("No Results Found");

          }
          
          
        res.render('editGroup', {groupMembers : result1, queryResults: users, idKeys: ids, uID : loggedInID, userList: result, groupName: nameG, groupID : gID});

    });

}); 
});
});
module.exports=router;
