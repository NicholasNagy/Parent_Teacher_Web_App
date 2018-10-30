var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require('../routes/dbConfig');
var signup = require('../routes/signup');
var login = require('../routes/functions');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();

let signupteacher = new Promise(function(resolve, reject){
  resolve(signup.insertdb("test","testtest","testtest@testtest","test",1));
});

let signupparent = new Promise(function(resolve, reject){
  resolve(signup.insertdb("testtest","test","test@test","testtest",0));
});

let teachertest = new Promise(function(resolve, reject){
signupteacher.then(function(success){
  if(success){
    let authenticationsuccess = new Promise(function(resolve, reject){
      resolve(login.authenticate("testtest@testtest", "test"));
    });

    authenticationsuccess.then(function(teacher){
      if(teacher.length==0){
        console.log("teacher authentication has failed:")
        console.log("No matches found for email: testtest@testtest and password: test");
        resolve(5);
      }
      else{
        //test the obtained result
        var x = 0;
        if("test"==teacher[0].Fname){
          console.log("Teacher first name verified");
        }
        else{
          x++;
          console.log("Teacher first name failed verification");
        }
        if("testtest"==teacher[0].Lname){
          console.log("Teacher last name verified");
        }
        else{
          x++;
          console.log("Teacher last name failed verification");
        }
        if("testtest@testtest"==teacher[0].Email){
          console.log("Teacher email verified");
        }
        else{
          x++;
          console.log("Teacher email failed verification");
        }
        if("test"==teacher[0].Pass){
          console.log("Teacher password verified");
        }
        else{
          x++;
          console.log("Teacher password failed verification");
        }
        if(1==teacher[0].isTeacher){
          console.log("Teacher verified");
        }
        else{
          x++;
          console.log("Teacher failed verification");
        }

        if(x>0){
          console.log("One or more tests for teachers have failed");
          resolve(x);
        }
        else{
          console.log("teacher tests have all passed");
          resolve(x);
        }

      }
    });

  }
  else{
    //handle failure
    console.log("teacher signup failed, email is already in use");
    resolve(5);

  }
});
});

let parenttest = new Promise(function(resolve,reject){
signupparent.then(function(success){
  if(success){
    let authenticationsuccess = new Promise(function(resolve, reject){
      resolve(login.authenticate("test@test", "testtest"));
    });

    authenticationsuccess.then(function(parent){
      if(parent.length==0){
        console.log("parent authentication has failed:")
        console.log("No matches found for email: test@test and password: testtest");
        resolve(5);
      }
      else{
        //test the obtained result

        var x = 0;
        if("testtest"==parent[0].Fname){
          console.log("Parent first name verified");
        }
        else{
          x++;
          console.log("Parent first name failed verification");
        }
        if("test"==parent[0].Lname){
          console.log("Parent last name verified");
        }
        else{
          x++;
          console.log("Parent last name failed verification");
        }
        if("test@test"==parent[0].Email){
          console.log("Parent email verified");
        }
        else{
          x++;
          console.log("Parent email failed verification");
        }
        if("testtest"==parent[0].Pass){
          console.log("Parent password verified");
        }
        else{
          x++;
          console.log("Parent password failed verification");
        }
        if(0==parent[0].isTeacher){
          console.log("Parent verified");
        }
        else{
          x++;
          console.log("Parent failed verification");
        }

        if(x>0){
          console.log("One or more tests for parents have failed");
          resolve(x);
        }
        else{
          console.log("Parent tests have all passed");
          resolve(x);
        }
      }
    });

  }
  else{
    //handle failure
    console.log("parent signup failed, email is already in use");
    resolve(5);

  }
});
});
parenttest.then(function(presult){
teachertest.then(function(tresult){

var result = presult + tresult;

  console.log(result + " tests have failed");
  var passed = 10-result;
  console.log(passed+ " tests have passed");

  if(result>0){
    console.log("Now exiting with exit code 1");
    process.exit(1);
  }
  else{
    console.log("Now exiting with exit code 0");
    process.exit(0);
  }
});
});
