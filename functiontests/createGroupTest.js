var mysql = require('mysql');
var DBconnect = require('../routes/dbConfig');
var functions = require('../routes/functions');

var pool = new DBconnect();



//Promise to create a group
let createNewGroupPromise = new Promise(function(resolve, reject){
    resolve(functions.createGroup('test-Group', '1'));
});

var checkGroupSQL = "SELECT groupName FROM groups where memberID='1';";


createNewGroupPromise.then((successMessage) => {
    console.log(successMessage);
  
    pool.connection.query(checkGroupSQL, function(err, results){
      if(err) throw err;
  
      //If SQL select statement returns some results
      if(results.length>0){
  
        var groupNumber = 0; 


        //Check if those results are valid, if so, the test is successful.
        if(results[results.length-1].groupName=="test-Group"){
            console.log("Test For Creating a group was successful");
            process.exit(0);
        }
        else{
            console.log("Test For Creating a group has failed");
            process.exit(1);
        }
  
      }
      else{
        console.log("No results were found");
        process.exit(2);
      }
    });

});

