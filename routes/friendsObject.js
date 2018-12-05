var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var pool = new DBconnect();
var notifications = require('./functions');


var getFriendsPage = function(userID){
  return new Promise(function(resolve, reject){

  var friendsList = "SELECT friendName,f2 FROM friends where f1='"+userID+"';";

  pool.connection.query(friendsList, function (error, results) {
      if (error)
          throw error;
          var getPostNotifications = new Promise(function(resolve, reject){
              resolve(notifications.getPostNotifications(userID));
            });

            getPostNotifications.then(function(postNotifications){


              var getMessengerNotific = new Promise(function(resolve, reject){
                resolve(notifications.getMessengerNotification(userID));
              });

              getMessengerNotific.then(function(messengerNotifications){
              resolve({friendsList:results, notification:postNotifications, messengerNotific:messengerNotifications});
              });
            });
  });
});

}



module.exports= {

  getFriendsPage: getFriendsPage

};
