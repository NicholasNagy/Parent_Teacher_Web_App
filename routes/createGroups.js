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

    var groupName = req.body.groupName;
    var userID = req.body.userID;

    let createNewGroup = new Promise(function(resolve, reject){
        resolve(functions.createGroup(groupName, userID));
    });

    createNewGroup.then(function(successMessage){
        console.log(successMessage);

        var userName = "SELECT Fname,Lname FROM users where ID='"+userID+"';";

        pool.connection.query(userName, function (error, result) {
            if (error) throw error;
            
            //NEW SELECT STATEMENT TO DISPLAY THE PROPER POSTS FOR THE INDIVIDUAL
            var displayGroups = "SELECT groupName,groupID FROM groups where memberID='"+userID+"';";

            pool.connection.query(displayGroups, function (error, results) {
                if (error) throw error;
        
                res.render('groups', {groupList : results, uID : userID, name:result[0].Fname});
            }); 

        });   
    });



   

});
module.exports = router;
