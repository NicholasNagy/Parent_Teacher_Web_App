var mysql = require('mysql');
var DBconnect = require('../routes/dbConfig');
//var pool = new DBconnect();

var functions = require('../routes/functions');
var pool = new DBconnect();



//Promise that Comment will be sent
let CommentPromise = new Promise((resolve, reject) => {
  resolve(functions.comment("This is a test comment", "100", "2"));
});


var CommentSQL = "SELECT Content, PostID, commenterID FROM comments where Content='This is a test comment' AND PostID='100' AND commenterID='2';";

CommentPromise.then((successMessage) => {
  console.log(successMessage);

  pool.connection.query(CommentSQL, function(err, results){
    if(err) throw err;

    //If SQL select statement returns some results
    if(results.length>0){

      //Check if those results are valid, if so, the test is successful.
      if(results[0].Content=="This is a test comment" && results[0].PostID=="100" && results[0].commenterID=="2" ){
          console.log("Commenting is working");
          process.exit(0);
      }
      else{
          console.log("Commenting has failed");
          process.exit(1);
      }

    }
    else{
      console.log("No results were found");
      process.exit(2);
    }
  });

});