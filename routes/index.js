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

/*var connection;

function handleDisconnect() {
 connection = mysql.createConnection(db_config);


 connection.connect(function(err) {
   if(err) {
     console.log('error when connecting to db:', err);
     setTimeout(handleDisconnect, 2000);
   }
 });

 connection.on('error', function(err) {
   console.log('db error', err);
   if(err.code === 'PROTOCOL_CONNECTION_LOST') {
     handleDisconnect();
   }
   else if(err.code === 'ETIMEDOUT'){
    handleDisconnect();
  }
   else {
     throw err;
   }
 });
}

handleDisconnect(); */
/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});





router.post('/signup', function(req,res){
  var isTeacher;
    if(req.body.account==="parent"){
      isTeacher = 0;
    }
    else {
      isTeacher = 1;
    }

        //initializing variables
        var fName=req.body.firstName;
        var lName=req.body.lastName;
        var Email=req.body.email;
        var pass = req.body.password;

        let signupinsert = new Promise(function(resolve, reject){
          resolve(signup.insertdb(fName, lName, Email, pass, isTeacher));
        });

        signupinsert.then(function(success){
          if(success)
            res.send("signup successful");
          else {
            res.send("email is already in use");
          }
        });



});



module.exports = router;
