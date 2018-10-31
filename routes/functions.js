var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var pool = new DBconnect();

var posting = function (post, WallID, PosterID){
  console.log("Preparing to add post to DB");
  //CREATING SQL METHOD
  var postSQL = "INSERT INTO post (Content, WallID, PosterID, TheDate, likes) VALUES ('"+post+"', '"+WallID +"', '"+PosterID+"', NOW(), 0);";
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
};

var getWallPosts = function(WallID){

      return new Promise(function(resolve, reject){

        var posts = "SELECT Content, postID, likes FROM post where WallID='"+WallID+"';";

        pool.connection.query(posts, function (error, results) {
          if (error)
              throw error;
          resolve(results);
        });


      });
};



var authenticate = function(email, pass){
  return new Promise(function(resolve, reject){
    //make querying statements, first one searches through the Parents table for
    //the same email and password, while the other searches through the teachers table
    var sql = "SELECT Email, Pass, Fname, Lname, isTeacher, ID from Users where Email='"+email+"' and Pass='"+pass+"';";

    //below checks the query for the same email and password
    pool.connection.query(sql, function (err, result){
        if (err) throw err;
        resolve(result);
      });
  });
}


var editProfile = function(userFName, userLName, password, email, userID){
  var updateUser = "UPDATE Users SET Fname = '"+userFName+"', Lname = '"+ userLName +"', Pass='"+password+"' WHERE ID='"+userID+"';";

  return new Promise(function(resolve, reject){
    pool.connection.query(updateUser, function(err, result){
      if(err) throw err;
      console.log("hello");

      resolve(viewProfile(userID));
    });
  });
};

var viewProfile = function(userID){
  return new Promise(function(resolve, reject){
    var getUser = "Select * FROM Users where ID='"+userID+"';";
    pool.connection.query(getUser, function(error, user){
      if(error) throw error;
      resolve(user[0]);
    });
  });
}


module.exports= {
  post: posting,
  comment: commenting,
  authenticate: authenticate,
  getWallPosts: getWallPosts,
  update: editProfile,
  viewProfile: viewProfile
};
