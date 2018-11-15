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


var deleteImageSQL = "DELETE FROM post WHERE  WallID='2' AND PosterID='2' AND Content='Test with post content' AND Image='test-Image.png';";

var verifydeletion = "SELECT * FROM post WHERE  WallID='2' AND PosterID='2' AND Content='Test with post content' AND Image='test-Image.png';";


pool.connection.query(deleteImageSQL, function(err, result){
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