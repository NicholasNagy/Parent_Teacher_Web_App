var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var pool = new DBconnect();

var posting = function (post, WallID, PosterID, imageName){
  console.log("Preparing to add post to DB");
  console.log(imageName);
  //CREATING SQL METHOD
    var postSQL = "INSERT INTO post (Content, WallID, PosterID, TheDate, likes, Image) VALUES ('"+post+"', '"+WallID +"', '"+PosterID+"', NOW(), 0, '"+imageName+"');";

  //INSERTING THE NEW POST
  return new Promise(function(resolve, reject){
    pool.connection.query(postSQL, function (err, result) {
        if (err)
            throw err;
          resolve("Post is added to DB");//NOTIFYING OF ADDITION ON CONSOLE
    });

  });

};

var commenting = function(comment, postID, commenterID){

  console.log("Preparing to add comment to DB");

  var postSQL = "INSERT INTO comments (Content, PostID, commenterID) VALUES ('"+comment+"', '"+postID +"', '"+commenterID+"');";// !Should add fields for unique IDs !

  return new Promise(function(resolve, reject){
    pool.connection.query(postSQL, function (err, result) {
      if (err)
          throw err;
        resolve("Comment is added to DB");//NOTIFYING OF ADDITION ON CONSOLE
    });
  });

};

var generateComments = function(postID, userName, userID){
  console.log(postID);
//CREATING SQL STATEMENTS
  var post = "SELECT * FROM post join Users ON post.PostID='"+postID+"' AND post.posterID=Users.ID;";
  var comments = "SELECT * FROM comments join Users ON comments.commenterID=Users.ID AND comments.PostID='"+postID+"';";

  //SQL QUERY HERE
  return new Promise(function(resolve, reject){
  pool.connection.query(post, function (err, resultP){
      if (err) throw err;
      pool.connection.query(comments, function (err, result){
        if (err) throw err;

          resolve({comments : result, postID, post: resultP[0].Content, posterName:resultP[0].Fname, name: userName, userID: userID});

    });

  });
  });
};



var getWallPosts = function(WallID){

      return new Promise(function(resolve, reject){

        var posts = "SELECT Fname, Content, postID, posterID, WallID, likes, Image FROM post join Users ON post.WallID='"+WallID+"' AND post.posterID=Users.ID ORDER BY post.postID DESC;";

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

};


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
  viewProfile: viewProfile,
  generateComments: generateComments,
};
