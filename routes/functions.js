var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var pool = new DBconnect();

var posting = function (post, ClassID, TeacherID){
  //CREATING SQL METHOD
  var postSQL = "INSERT INTO posts (content, ClassID, TeacherID, TheDate) VALUES ('"+post+"', '"+ClassID +"', '"+TeacherID+"', NOW());";
  //INSERTING THE NEW POST
  pool.connection.query(postSQL, function (err, result) {
      if (err)
          throw err;
      console.log("Post is added to DB");//NOTIFYING OF ADDITION ON CONSOLE

  });

};

var commenting = function(comment, postID){
  var postSQL = "INSERT INTO comments (Content, PostID) VALUES ('"+comment+"', '"+postID +"');";// !Should add fields for unique IDs !
  pool.connection.query(postSQL, function (err, result) {
    if (err)
        throw err;
    console.log("Comment is added to DB");//NOTIFYING OF ADDITION ON CONSOLE
  });
}

module.exports= {
  post: posting,
  comment: commenting
};
