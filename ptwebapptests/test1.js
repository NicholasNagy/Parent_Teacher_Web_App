var mysql = require('mysql');
//This test checks to see if the code was inserted into the database

var db_config ={

    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'b2af4a2e0e0550',
    password: '6424a2d3',
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

//building queries to check
var sql = "SELECT Fname FROM Parents where Fname='test' and Lname='testtest' and ChildID='12345' and Email='123@hotmail.com' and Pass='test'";
var thesql = "SELECT Fname FROM Teachers where Fname='test' and Lname='testtest' and ClassID='12345' and Email='12345@hotmail.com' and Pass='test'";
  //executing and handling queries
  connection.query(sql, function (err, result){
  if (err) throw err;

  if(result.length>0){
    console.log("parent was successfully inserted into DB");//feedback
    connection.query(thesql, function(err, results){
      if(err) throw err;


      if(results.length>0){
        console.log("teacher was successfully inserted into DB");//feedback
          process.exit(0);//if successful passing, exit with signal 0
      }
      else process.exit(1);//fail = exit with process other than 0
    })
  }
  else process.exit(1);//fail = exit with process other than 0

});

});

  connection.on('error', function(err) {

    console.log('db error', err);
    process.exit(0);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();
