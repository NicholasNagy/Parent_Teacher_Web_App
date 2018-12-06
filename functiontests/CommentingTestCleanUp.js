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


var deleteCommentSQL = "DELETE FROM comments WHERE Content='This is a test comment' AND PostID='100' AND commenterID='2';";

var verifydeletion = "SELECT * FROM comments WHERE Content='This is a test comments' AND PostID='100' AND commenterID='2';";


pool.connection.query(deleteCommentSQL, function(err, result){
  if(err) throw err;

  pool.connection.query(verifydeletion,function(error,results){
    if(error) throw error;

    if(results.length>0){
      console.log("Deletion failed, exiting with code: 1");
      process.exit(1);
    }
    else{
      console.log("Deletion success, ready for new test");
      process.exit(0);
    }

  })
});