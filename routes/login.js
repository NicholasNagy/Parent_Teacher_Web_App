var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require ('./dbConfig');
var login = require('./functions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();



router.post('/', function(req,res){
    //initializing the variables
    var email=req.body.email_logIn;
    var pass = req.body.password_logIn;

    let authenticationsuccess = new Promise(function(resolve, reject){
      resolve(login.authenticate(email,pass));
    });

    authenticationsuccess.then(function(user){
      if (user.length==0){
        console.log("unsuccessful login");
        res.send("unsuccessful login");
      }
      else{
        console.log("Login Successful");
        let getPosts = new Promise(function(resolve, reject){
          resolve(login.getWallPosts(user[0].ID));
        });

        getPosts.then(function(posts){
          if(user[0].isTeacher==0){
            res.render('homepage', {posts: posts, name: user[0].Fname, userID: user[0].ID});
            console.log("parenthomepage");
          }
          else{
            res.render('parenthomepage', {posts: posts, name:user[0].Fname, WallID:user[0].ID, PosterID:user[0].ID});
            console.log("teacherhomepage");
          }
        });
      }
    })



});




module.exports=router;
