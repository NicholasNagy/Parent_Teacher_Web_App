var serverr = require('../app');
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var socket = require('socket.io');
var bodyParser = require("body-parser");
var router = express.Router();
var DBconnect = require ('./dbConfig');
var functions = require('./functions');

var pool = new DBconnect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));


router.post('/', function(req, res) {
    // var naming = req.body.parent_name[0];
    //we test if the name is from a teacher name or a parent name

    var userID = req.body.userID;
    var friendID = req.body.friendID;
  
    let getUser = new Promise(function(resolve, reject){
      resolve(functions.getUser(userID));
    });
    getUser.then(function(user){
      res.render('messenger', {name: user.Fname, userID: user.ID, friendID: friendID});
    });

    app.use(express.static('public'));
    var io = socket(serverr.servers);

    io.on('connection', (socket) => {
        var oldChatList = "SELECT Users.Fname AS fromName, thechats.Content AS content FROM thechats JOIN Users ON (((senderID='"+userID+"' AND receiverID='"+friendID+"') OR (senderID='"+friendID+"' AND receiverID='"+userID+"')) AND Users.ID=thechats.senderID) ORDER BY thechats.chatTime ASC;";
        pool.connection.query(oldChatList, function (error, results) {
            if (error)
                throw error;
            else{

                io.sockets.emit('oldChat',results);

            }
        });
        console.log('made socket connection', socket.id);
        socket.on('chat', function(data){
             console.log(data);
            console.log("The user ID is "+data.realUserID+" and the friend ID is "+data.realFriendID);
             var chatSQL="INSERT INTO thechats (senderID, receiverID, content, chatTime) values ('"+data.realUserID+"', '"+data.realFriendID+"','"+data.message+"', NOW() );";
            pool.connection.query(chatSQL, function (error, results) {
                if (error)
                    throw error;
            });
            io.sockets.emit('chat', data);

        });
    });
    // socket.on('typing', function(data){
    //     socket.broadcast.emit('typing', data);
    // });


});


module.exports = router;