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

    var displayGroups = "SELECT groupName,groupID FROM groups where memberID='"+userID+"';";

    pool.connection.query(displayGroups, function (error, results) {
        if (error)
            throw error;
    
         
          res.render('groups', {groupList : results, uID : userID});
    
    });

            


});


module.exports = router;