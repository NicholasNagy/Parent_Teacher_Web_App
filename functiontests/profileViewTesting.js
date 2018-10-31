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

let getUserInfo = new Promise(function(resolve, reject){
  resolve(user.viewProfile(241));
});

getUserInfo.then(function(userInfo){
  //test the obtained result

  var x = 0;
  if("New "==userInfo.Fname){
    console.log("First name verified");
  }
  else{
    x++;
    console.log("First name failed verification");
  }
  if("Parent"==userInfo.Lname){
    console.log("Last name verified");
  }
  else{
    x++;
    console.log("Last name failed verification");
  }
  if("saumon22"==userInfo.Pass){
    console.log("Password verified");
  }
  else{
    x++;
    console.log("New password failed verification");
  }
  if("newparent@hotmail.com"==userInfo.Email){
    console.log("Email is verified");
  }
  else{
    x++;
    console.log("Email failed verification");
  }
  if(241==userInfo.ID){
    console.log("ID verified");
  }
  else{
    x++;
    console.log("ID failed verification");
  }
  if(0==userInfo.isTeacher){
    console.log("Permissions verified");
  }
  else{
    x++;
    console.log("Permissions failed verification");
  }



    if(x>0){
      console.log(x+"/6 tests have failed");
      console.log("Exiting with exit code: 1");
      process.exit(1);
    }
    else{

      console.log("All tests have passed");
      console.log("Exiting with exit code: 0");
      process.exit(0);
    }
});
