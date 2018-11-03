var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require ('./dbConfig');
var profile = require('./functions');

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

let editedProfile = new Promise(function(resolve, reject){
  resolve(profile.update(userFName, userLName, password, email, userID));
});

editedProfile.then(function(user){
  res.render('profile', {userType:userType, userID:user.ID, name:user.Fname, userLname:user.Lname, userEmail:user.Email, userPass:user.Pass});
});

});



module.exports = router;
