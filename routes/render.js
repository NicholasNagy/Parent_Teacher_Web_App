var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();

var renderWall = function(posts, WallID, userID){

    var getFname= "SELECT Fname FROM Users WHERE ID='"+userID+"';";
    pool.connection.query(getFname, function(err, name){
      if(err) throw err;
      resolve({posts:posts, name: name, WallID:WallID, userID:userID});
    });

};
