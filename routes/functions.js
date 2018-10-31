var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var pool = new DBconnect();

var posting = function (post, WallID, PosterID, imageName){
  console.log("Preparing to add post to DB");
  console.log(imageName);
  //CREATING SQL METHOD
  var postSQL = "INSERT INTO post (Content, WallID, PosterID, TheDate, Image) VALUES ('"+post+"', '"+WallID +"', '"+PosterID+"', NOW(), '"+imageName+"');";
  //INSERTING THE NEW POST
  return new Promise(function(resolve, reject){
    pool.connection.query(postSQL, function (err, result) {
        if (err)
            throw err;
          resolve("Post is added to DB");//NOTIFYING OF ADDITION ON CONSOLE
    });

  });

};

var commenting = function(comment, postID){

  console.log("Preparing to add comment to DB");

  var postSQL = "INSERT INTO comments (Content, PostID) VALUES ('"+comment+"', '"+postID +"');";// !Should add fields for unique IDs !

  return new Promise(function(resolve, reject){
    pool.connection.query(postSQL, function (err, result) {
      if (err)
          throw err;
        resolve("Comment is added to DB");//NOTIFYING OF ADDITION ON CONSOLE
    });
  });
}

module.exports= {
  post: posting,
  comment: commenting
};
