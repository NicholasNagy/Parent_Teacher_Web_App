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

    var friendList1 = "SELECT f2,friendName,f1Name FROM friends where f1='"+loggedInID+"';";
    var friendList2 = "SELECT f1,f1Name,friendName FROM friends where f2='"+loggedInID+"';";

pool.connection.query(friendList1, function (error, results1){
  if (error) throw error;
  pool.connection.query(friendList2, function (error, results2){
    if (error) throw error;


    fullList =  results1.concat(results2);
         


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


        res.render('friends', {queryResults: users, idKeys: ids, userID : loggedInID, friendsList: fullList, name:userName});

    });

});
});
});
module.exports=router;
