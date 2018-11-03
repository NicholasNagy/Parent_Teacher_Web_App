var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require ('./dbConfig');
var user = require('./functions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();



router.post('/', function(req,res){
    //initializing the variables
    var email=req.body.email_logIn;
    var pass = req.body.password_logIn;

    //make querying statements, first one searches through the Parents table for
    //the same email and password, while the other searches through the teachers table

    let authentication = new Promise(function(resolve, reject){
      resolve(user.authenticate(email, pass));
    });

    authentication.then(function(theuser){
      if(theuser.length==0){
        console.log("unsuccessful login");
        res.send("unsuccessful login");
      }
      else{
        let wallPosts = new Promise(function(resolve, reject){
          resolve(user.getWall(theuser[0].ID, theuser[0].ID));
        });

        wallPosts.then(function(wall){
          res.render('parenthomepage', wall);
        });
      }
    });

});




module.exports=router;
