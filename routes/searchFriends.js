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
    var userName = req.body.userName;

    var query = "SELECT Fname,Lname,ID FROM users";

   var friendsList = "SELECT friendName,f2 FROM friends where f1='"+loggedInID+"';";

pool.connection.query(friendsList, function (error, result){
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


        res.render('friends', {queryResults: users, idKeys: ids, userID : loggedInID, friendsList: result, name:userName});

    });

});
});

module.exports=router;
