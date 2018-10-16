var mysql = require('mysql');
var DBconnect = require('../routes/dbConfig');
var pool = new DBconnect();

var functions = require('./functions');

var pool = new DBconnect();

//TESTING POSTING && COMMENTING

functions.post("This is a test post", "123", "5");
functions.comment("This is a test comment", 5);

var checkPost = "SELECT Content, ClassID, TeacherID FROM posts where ClassID='123' AND TeacherID='5' AND Content='This is a test post';";


pool.connection.query(checkPost, function(err, results){
  if(err) throw err;

  if(results.length>0){
    if(results[0].Content=="This is a test post" && results[0].TeacherID=="5" && results[0].ClassID=="123")
      console.log("post successfully inserted");

    var checkComment = "Select Content, PostID FROM comments where Content='This is a test comment' AND PostID='5';"
    pool.connection.query(checkComment, function(error, theresult){
      if(err) throw err;

      if(results.length>0){
        if(theresult[0].Content=="This is a test comment" && theresult[0].PostID=="5")
          console.log("comment successfully inserted");

        process.exit(0);
      }
      else{
        process.exit(1);
      }
    });
  }
  else{
    process.exit(1);
  }
});
