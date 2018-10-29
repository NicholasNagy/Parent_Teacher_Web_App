var mysql = require('mysql');
var DBconnect = require('../routes/dbConfig');
var pool = new DBconnect();

var functions = require('../routes/functions');

var pool = new DBconnect();

var deletePost="DELETE FROM post WHERE PosterID='2';";

pool.connection.query(deletePost, function(err, result){
  if(err) throw err;

  var deleteComment="DELETE FROM comments WHERE Content='This is a test comment' AND PostID='2';";
  pool.connection.query(deleteComment, function(error, results){
    if(error) throw error;

    var checkPost="SELECT Content, PosterID, WallID FROM post where WallID='2';";
    pool.connection.query(checkPost, function(theerror, noresult){
      if(theerror) throw theerror;
      if(noresult.length>0){
        console.log("unsuccesfully deleted test posts");
        process.exit(1);
      }

      else{
        console.log("successuly deleted test posts");
        var checkComment="Select Content, PostID FROM comments where PostID='2';"
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
