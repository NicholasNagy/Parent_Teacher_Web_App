var mysql = require('mysql');
var DBconnect = require('../routes/dbConfig');
//var pool = new DBconnect();

var functions = require('../routes/functions');
var pool = new DBconnect();


let searchPromise = new Promise((resolve, reject) => {
  //INPUT THE TEST QUERY NAME AS THE PARAMATER OF THE SEARCH FUNCTION
  queryName = "mak";
  resolve(functions.search());
});


var userQuery = "SELECT Fname,Lname FROM users where Fname='"+queryName+"' OR Lname='"+queryName+"';";

pool.connection.query(userQuery, function(err, results){
  if(err) throw err;

searchPromise.then((usersTable) => {

  var users=[];
  var fullName;
  console.log(usersTable);
  
  for(var i =0; i < usersTable.length; i++){

    var fullName = usersTable[i].Fname + " " + (usersTable[i].Lname);

    if( (usersTable[i].Fname == queryName) || (usersTable[i].Lname == queryName) || (fullName == queryName)  ){

     
     users.push(fullName);

    }
  }
  console.log("filered " + users.length);
  console.log("sql " + results.length);

  if(users.length == 0 ){
    users.push("No Results Found");
    console.log("No result found for specified query name.");
    process.exit(0);


  }
  if(users.length != results.length){

    console.log("Fail. Results don't match.");
    process.exit(1);
  }else{
    // Compare filtered results with query

    console.log("Success. Results match.");
    process.exit(0);
  }


  });
});

 