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
  //GET ids.
    var loggedInID = req.body.logID;
    var friendID = req.body.idToAdd;
    var userName = req.body.userName;
    console.log(loggedInID + " is adding " + friendID + " as a friend.");

//Getting the friend the user wants to add.
    var friendADD = "SELECT Fname,Lname FROM users where ID='"+friendID+"';";

pool.connection.query(friendADD, function (err, result){
      if (err) throw err;



  //Adding the friend connection in the DB.
  //Trying to replace duplicates but it does not appear to be working.
  var addToTable = "Replace INTO  friends (f1, f2, friendName) VALUES ('"+loggedInID+"','"+friendID+"','"+result[0].Fname + " " + result[0].Lname+"')";

    pool.connection.query(addToTable, function (error, results) {
      if (error)
          throw error;

//Getting the user's entire friends list to display it.
var friendList = "SELECT friendName,f2 FROM friends where f1='"+loggedInID+"';";

            pool.connection.query(friendList, function (error, results) {
              if (error)
                 throw error;


               res.render('friends', {friendsList: results, userID : loggedInID, name:userName});

              });


      });

});
});

module.exports=router;
