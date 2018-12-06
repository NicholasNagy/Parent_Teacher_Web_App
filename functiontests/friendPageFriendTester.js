var mysql = require('mysql');
var DBconnect = require('../routes/dbConfig');
var pool = new DBconnect();
var friends = require('../routes/friendsObject');

var friendsList = "SELECT * FROM friends where f1='1';"
pool.connection.query(friendsList, function(error, actualFriends){
  if(error) throw error;

  var getFriendsPage = new Promise(function(resolve, reject){
    resolve(friends.getFriendsPage(1));
  });
  getFriendsPage.then(function(friendsPage){

    var numberOfFriends = friendsPage.friendsList.length;

    var numberOfMatches = 0;

    for(var i = 0; i<numberOfFriends;i++){
      for(var x = 0; x< actualFriends.length;x++){
        if(friendsPage.friendsList[i].f2==actualFriends[x].f2){
          console.log("Matched friend id: "+ actualFriends[x].f2);
          numberOfMatches++;
        }
      }
    }

    if(numberOfMatches==numberOfFriends){
      console.log("Test is passed, all matches found");
      process.exit(0);

    }
    else{
      console.log("Test did no pass, some matches not found")
      process.exit(1);
    }

  });
});
