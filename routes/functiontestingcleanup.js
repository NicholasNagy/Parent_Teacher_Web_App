var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var pool = new DBconnect();

var functions = require('../routes/functions');

var pool = new DBconnect();

var deletePost="DELETE FROM posts WHERE ClassID='123' AND TeacherID='5' AND Content='This is a test post';";

pool.connection.query(deletePost, function(err, result){
  if(err) throw err;

  var deleteComment="DELETE FROM comments WHERE Content='This is a test comment' AND PostID='5';";
  pool.connection.query(deleteComment, function(error, results){
    if(error) throw error;

    var checkPost="SELECT Content, ClassID, TeacherID FROM posts where ClassID='123' AND TeacherID='5' AND Content='This is a test post';";
    pool.connection.query(checkPost, function(theerror, noresult){
      if(theerror) throw theerror;
      if(noresult.length>0){
        console.log("unsuccesfully deleted test posts");
        process.exit(1);
      }

      else{
        console.log("successuly deleted test posts");
        var checkComment="Select Content, PostID FROM comments where Content='This is a test comment' AND PostID='5';"
        pool.connection.query(checkComment, function(someerror, noneresult){
          if(someerror) throw someerror;
          if(noneresult.length>0){
            console.log("unsuccesfully deleted comments");
            process.exit(1);
          }
          else{
            console.log("successfully deleted comments");
            console.log("all checks passed, posts and comments work");
            process.exit(0);
          }
        })
      }
    });
  });
});
