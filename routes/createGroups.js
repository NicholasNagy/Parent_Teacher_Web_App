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

    var groupName = req.body.groupName;
    var userID = req.body.userID;

    var userName = "SELECT Fname,Lname FROM users where ID='"+userID+"';";

    pool.connection.query(userName, function (error, result) {
        if (error)
            throw error;


    //Creating the group

     var createGroup = "INSERT into groups (memberID,Fname,Lname, groupName) VALUES ('"+userID+"','"+result[0].Fname+"','"+result[0].Lname+"','"+groupName+"')";

            pool.connection.query(createGroup, function (error, result0) {
             if (error)
                  throw error;



    //Getting the users groups to display

    var displayGroups = "SELECT groupName,groupID FROM groups where memberID='"+userID+"';";

                  pool.connection.query(displayGroups, function (error, results) {
                     if (error)
                           throw error;


                         res.render('groups', {groupList : results, uID : userID, name:result[0].Fname});

                  });



        });

});

});
module.exports = router;
