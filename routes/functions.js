var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var pool = new DBconnect();

var tag = function(tag1, tag2, tag3, tag4, tag5, postID){
  return new Promise(function(resolve, reject){

    sqltag1 = ""; sqltag2 = ""; sqltag3 = ""; sqltag4 = ""; sqltag5 = "";

    if(tag1!=undefined){
      sqltag1="INSERT INTO postTagNotifications (taggedFriend, postID, postDate) VALUES ('"+tag1+"','"+postID+"', NOW());";
      pool.connection.query(sqltag1,function(error, noth){
        if(error) throw error;
      });
    }
    if(tag2!=undefined){
      sqltag2="INSERT INTO postTagNotifications (taggedFriend, postID, postDate) VALUES ('"+tag2+"','"+postID+"', NOW());";
      pool.connection.query(sqltag2,function(error, noth){
        if(error) throw error;
      });
    }
    if(tag3!=undefined){
      sqltag3="INSERT INTO postTagNotifications (taggedFriend, postID, postDate) VALUES ('"+tag3+"','"+postID+"', NOW());";
      pool.connection.query(sqltag3,function(error, noth){
        if(error) throw error;
      });
    }
    if(tag4!=undefined){
      sqltag4="INSERT INTO postTagNotifications (taggedFriend, postID, postDate) VALUES ('"+tag4+"','"+postID+"', NOW());";
      pool.connection.query(sqltag4,function(error, noth){
        if(error) throw error;
      });
    }
    if(tag5!=undefined){
      sqltag5="INSERT INTO postTagNotifications (taggedFriend, postID, postDate) VALUES ('"+tag5+"','"+postID+"', NOW());";
      pool.connection.query(sqltag5,function(error, noth){
        if(error) throw error;
      });
    }

    resolve("done");

  });
};


var posting = function (post, WallID, PosterID, imageName, tag1, tag2, tag3, tag4, tag5){
  console.log("Preparing to add post to DB");
  console.log(imageName);
  //CREATING SQL METHOD
    var postSQL = "INSERT INTO post (Content, WallID, PosterID, TheDate, likes, Image) VALUES ('"+post+"', '"+WallID +"', '"+PosterID+"', NOW(), 0, '"+imageName+"');";

  //INSERTING THE NEW POST
  return new Promise(function(resolve, reject){
    pool.connection.query(postSQL, function (err, r) {
        if (err)
            throw err;


            var postID = r.insertId;

            let tagging=new Promise(function(resolve, reject){
              resolve(tag(tag1,tag2,tag3,tag4,tag5, postID));
            });
            tagging.then(function(answer){
              resolve("post has been added to db");
            });

    });

  });

};

var commenting = function(comment, postID, commenterID, tag1, tag2, tag3, tag4, tag5){

  console.log("Preparing to add comment to DB");

  var postSQL = "INSERT INTO comments (Content, PostID, commenterID) VALUES ('"+comment+"', '"+postID +"', '"+commenterID+"');";// !Should add fields for unique IDs !

  return new Promise(function(resolve, reject){
    pool.connection.query(postSQL, function (err, result) {
      if (err)
          throw err;

        let tagging= new Promise(function(resolve, reject){
          resolve(tag(tag1,tag2,tag3,tag4,tag5, postID));
        });
        tagging.then(function(stuff){
          resolve("Comment is added to DB");//NOTIFYING OF ADDITION ON CONSOLE
        });
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

        let theFriends= new Promise(function(resolve,reject){
          resolve(getFriends(userID));
        });
        theFriends.then(function(friends){
          resolve({comments : result, postID, post: resultP[0].Content, posterName:resultP[0].Fname, name: userName, userID: userID, friends:friends});
        });
    });

  });
  });
};



var getWall = function(WallID, userID){

      return new Promise(function(resolve, reject){

        var posts = "SELECT Fname, Content, postID, posterID, WallID, likes, Image FROM post join Users ON post.WallID='"+WallID+"' AND post.posterID=Users.ID ORDER BY post.postID DESC;";


        pool.connection.query(posts, function (error, results) {
          if (error)
              throw error;

         let theFriends= new Promise(function(resolve,reject){
           resolve(getFriends(userID));
         });

          let user = new Promise(function(resolve, reject){
            resolve(getUser(userID));
          });

          user.then(function(theuser){
            let getPostNotific= new Promise(function (resolve,reject) {
                resolve(getPostNotifications(userID));
            });
            let getMessengerNotific = new Promise(function (resolve,reject) {
                resolve(getMessengerNotification(userID))
            });
            getMessengerNotific.then(function (MessNotific) {
            getPostNotific.then(function (PostNotification) {
            theFriends.then(function(friends){
              resolve({posts:results, name:theuser.Fname, WallID:WallID, userID:userID, notification: PostNotification, messengerNotific:MessNotific , friends: friends});
            });
            });
            });
          });
        });
    });
};

var getPostNotifications = function(userID){
    //group by
    return new Promise(function(resolve, reject){
        var getPosts = "SELECT * FROM post join Users ON post.WallID='"+userID+"' AND post.WallID!=post.posterID AND post.posterID=Users.ID ORDER BY post.postID DESC;";
        pool.connection.query(getPosts,function(err, notifications){
            if(err) throw err;
            resolve(notifications);
        });

    });
};
var getMessengerNotification = function(userID){
    //group by
    return new Promise(function(resolve, reject){
        var getMessenger = "SELECT * FROM thechats join Users ON thechats.receiverID='"+userID+"' AND thechats.senderID=Users.ID GROUP By senderID ORDER BY thechats.chatID DESC;";
        pool.connection.query(getMessenger,function(err, notifications){
            if(err) throw err;
            resolve(notifications);
        });

    });
};

var getUser = function(userID){
  return new Promise(function(resolve, reject){
    var theuser = "SELECT * FROM Users WHERE ID='"+userID+"';";
    pool.connection.query(theuser, function(err, user){
      if(err) throw err;
      resolve(user[0]);
    });
  });
};

var getFriends = function(userID){
  return new Promise(function(resolve, reject){
    var sqlFriends = "Select f1, f2, Fname, Lname, ID from friends join Users ON (f1='"+userID+"' AND f2=Users.ID) OR (f2='"+userID+"' AND f1=Users.ID) group by Users.ID;";
    pool.connection.query(sqlFriends, function(err, result){
      if(err) throw err;
      resolve(result);
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




var creatingGroups = function (groupName, userID){

    console.log("Creating A group");
    console.log(groupName);

    //CREATING SQL METHOD
    var userName = "SELECT Fname,Lname FROM users where ID='"+userID+"';";

    //INSERTING THE NEW POST
    return new Promise(function(resolve, reject){

      pool.connection.query(userName, function (error, result) {
        if (error) throw error;

        //Creating the group
        var createGroup = "INSERT into groups (memberID,Fname,Lname, groupName) VALUES ('"+userID+"','"+result[0].Fname+"','"+result[0].Lname+"','"+groupName+"')";

        pool.connection.query(createGroup, function (error, result0) {
            if (error) throw error;

            resolve("Group is added to DB");
        });
      });
    });

  };

  var search = function (){

    console.log("Getting user table.");

    var userTable = "SELECT ID, Fname, Lname, Email from users";
    return new Promise(function(resolve, reject){
    pool.connection.query(userTable, function (error, result){
      if (error)
              throw error;

           resolve(result);
    });
  });
}




module.exports= {
  post: posting,
  comment: commenting,
  authenticate: authenticate,
  getWall: getWall,
  update: editProfile,
  viewProfile: viewProfile,
  generateComments: generateComments,
  getUser: getUser,
  createGroup:creatingGroups,
  search: search,
  getFriends:getFriends

};
