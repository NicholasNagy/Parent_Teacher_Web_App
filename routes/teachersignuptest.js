var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var db_config = {
    host: 'mysql-pnt-db.clokmnut66x8.us-east-1.rds.amazonaws.com',
   user: 'makchamp',
   password: 'Khanman69',
   database: 'heroku_1f20bf2d1e8055d'
};

var connection;

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

handleDisconnect();
/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('teachersignuptest', { title: 'Express' });
});

module.exports = router;
