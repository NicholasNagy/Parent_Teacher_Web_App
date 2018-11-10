var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var signup = require('./signup');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();





//signup inserting data into db

var insertdb = function(fName, lName, Email, pass, isTeacher){

  //creating queries, first one checks to see if there are any emails that
  //are the same the second inserts the data into the database
    var query1= "SELECT Pass FROM Users where Email='"+ Email+"';";

    var query = "SELECT Email FROM Users where Email='"+ Email+"';";
  var sql = "INSERT INTO  Users (Fname, Lname, Email, Pass, isTeacher) VALUES ('"+fName+"','"+lName+"', '"+Email+"', '"+pass+"','"+isTeacher+"')";

  //connecting to sql database to use the query
  return new Promise(function(resolve, reject){

      //below the query checks to see if any of the same emails exist
      //if they do, the method ends
      pool.connection.query(query, function(err, result){
          if(err) throw err;

          if(result.length>0){//checks to see if any results with the same email
              //turned up
              console.log("email is already in use: " + result[0].Email);


              //HANDLE EMAIL ALREADY IN USE CASE HERE
              resolve(false);
              //res.render('index',{title:'express'});
          }
          else{
              //if none were found, data is inserted into database
              pool.connection.query(sql, function (err, results){
                  if (err) throw err;
                  console.log("Result: " + results);

                  //below the homepage is rendered
                  //HANDLE BEING SENT TO HOMEPAGE HERE
                    resolve(true);

              });
          }
      });
    });

};



module.exports = {
  insertdb: insertdb
}
