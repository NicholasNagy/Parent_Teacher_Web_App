var mysql = require('mysql');
var DBconnect = require('../routes/dbConfig');
var pool = new DBconnect();

var functions = require('../routes/functions');

var pool = new DBconnect();

//TESTING POSTING && COMMENTING
let myFirstPromise = new Promise((resolve, reject) => {
  resolve(functions.post("This is a test post", "2", "2"));
});


let mySecondPromise = new Promise(function(resolve, reject){
  resolve(functions.comment("This is a test comment", 2));
});
var checkPost = "SELECT Content, WallID, PosterID FROM post where WallID='2' AND PosterID='2' AND Content='This is a test post';";

myFirstPromise.then((successMessage) => {
  console.log(successMessage);

pool.connection.query(checkPost, function(err, results){
  if(err) throw err;

  if(results.length>0){
    mySecondPromise.then(function(successorMessage){
      console.log(successorMessage);

    if(results[0].Content=="This is a test post" && results[0].WallID=="2" && results[0].PosterID=="2")
      console.log("post successfully inserted");

    var checkComment = "Select Content, PostID FROM comments where Content='This is a test comment' AND PostID='2';"
    pool.connection.query(checkComment, function(error, theresult){
      if(err) throw err;

      if(results.length>0){
        if(theresult[0].Content=="This is a test comment" && theresult[0].PostID=="2")
          console.log("comment successfully inserted");

        process.exit(0);
      }
      else{
        console.log("commenting failed");
        process.exit(1);
      }
    });
    });
  }
  else{
    console.log("posting failed");
    process.exit(1);
  }
});

});
