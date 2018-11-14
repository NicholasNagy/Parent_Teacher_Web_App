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


var deleteGroupsSQL = "DELETE FROM groups WHERE memberID='1' AND groupName='test-Group';";

var verifydeletion = "SELECT * FROM groups WHERE memberID='1' AND groupName='test-Group';"


pool.connection.query(deleteGroupsSQL, function(err, result){
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