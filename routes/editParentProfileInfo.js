var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require ('./dbConfig');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();


router.post('/', function(req, res, next) {

var userFName = req.body.userFNameEdit;
var userLName = req.body.userLNameEdit;
var password = req.body.userPassEdit;
var email = req.body.userEmailEdit;
var userID = req.body.userIDEdit;
var userType = req.body.accountTpEdit;

console.log(userFName+userLName+password+email+userID+userType);

var ParentSQL = "UPDATE Parents SET Fname = '"+userFName+"', Lname = '"+ userLName +"', Pass='"+password+"' WHERE ParentID='"+userID+"';";


pool.connection.query(ParentSQL, function(err, result){
  if(err) throw err;
  console.log("hello");
});
res.render('profile', {userType:userType, userID:userID, userFname:userFName, userLname:userLName, userEmail:email, userPass:password});


});


module.exports = router;
