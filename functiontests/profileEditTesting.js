var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require('../routes/dbConfig');
var signup = require('../routes/signup');
var user = require('../routes/functions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();

let thesignup = new Promise(function(resolve, reject){
  resolve(signup.insertdb("nicki", "nacki", "lili@liliiiii", "nicki", 1));
});



thesignup.then(function(success){
  if(success){
    console.log("signup successful");
    let authentication = new Promise(function(resolve,reject){
      resolve(user.authenticate("lili@liliiiii", "nicki"));
    });
    authentication.then(function(theuser){

      console.log("id of authenticated user:"+ theuser[0].ID);
      let insertNewInfo = new Promise(function(resolve, reject){
        resolve(user.update("nickii","nackii", "nickii", "nacnac@nacnac", theuser[0].ID));
      });

      insertNewInfo.then(function(thisuser){
        //test the obtained result

        var x = 0;
        if("nickii"==thisuser.Fname){
          console.log("New first name verified");
        }
        else{
          x++;
          console.log("New first name failed verification");
        }
        if("nackii"==thisuser.Lname){
          console.log("New last name verified");
        }
        else{
          x++;
          console.log("New last name failed verification");
        }
        if("nickii"==thisuser.Pass){
          console.log("New password verified");
        }
        else{
          x++;
          console.log("New password failed verification");
        }
        var deleteprofile = "DELETE FROM Users WHERE ID = '"+thisuser.ID+"' OR Email='lili@liliiiii';";


        console.log("Preparing to delete profile: "+ thisuser.ID);

        pool.connection.query(deleteprofile, function(err, theresults){

          if(x>0){
            console.log("Profile Deleted");
            console.log(x+"/3 tests have failed");
            console.log("Exiting with exit code: 1");
            process.exit(1);
          }
          else{
            console.log("Profile Deleted");
            console.log("All tests have passed");
            console.log("Exiting with exit code: 0");
            process.exit(0);
          }
        });
      });

    });
  }
  else{
    console.log("signup failed, email is already in use");

    var deleteprofile = "DELETE FROM Users WHERE Email='lili@liliiiii';";
    pool.connection.query(deleteprofile, function(err, results){
      if(err) throw err;

      console.log("Email is deleted");
      console.log("please restart the test");
      console.log("Exiting with exit code: 1");
      
      process.exit(1);
    });

  }
});
