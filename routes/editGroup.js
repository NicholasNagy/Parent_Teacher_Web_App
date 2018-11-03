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


    var selectGroup = "SELECT Fname,Lname,groupName,memberID,groupID FROM groups where groupID='"+gID+"';";


    pool.connection.query(selectGroup, function (error, results) {
        if (error)
            throw error;

        let getUser = new Promise(function(resolve, reject){
          resolve(functions.getUser(userID));
        });
        getUser.then(function(user){
          res.render('editGroup', {groupMembers : results, groupID : gID, uID : userID, groupName : results[0].groupName, name: user.Fname});
        });
    });








});


module.exports = router;
