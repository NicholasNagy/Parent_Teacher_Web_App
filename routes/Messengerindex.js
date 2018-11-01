var serverr = require('../app');
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var socket = require('socket.io');
var bodyParser = require("body-parser");
var router = express.Router();
var DBconnect = require ('./dbConfig');

var pool = new DBconnect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

router.post('/', function(req, res) {
    // var naming = req.body.parent_name[0];
    //we test if the name is from a teacher name or a parent name
    var naming;
    var fname;
    var parentID;
    if (req.body.teacher_name == undefined) {
        naming = req.body.ffnam + " -Parent";
        console.log("parent ID" + req.body.parentID);
        parentID= req.body.parentID;
    }

    else{
        naming = req.body.teacher_name + " -Teacher";
        parentID= req.body.parentID;
}
    //var naming = req.body.parent_name;
    res.render('messenger', {nm: naming});

    app.use(express.static('public'));
    var io = socket(serverr.servers);

    io.on('connection', (socket) => {

        var oldChatList = "SELECT fromName, content FROM chat where chatID='"+parentID+"';";
        pool.connection.query(oldChatList, function (error, results) {
            if (error)
                throw error;
            else{
                //console.log(results[0].fromName);
                io.sockets.emit('oldChat',results);
            }
        });
        console.log('made socket connection', socket.id);
        socket.on('chat', function(data){
             console.log(data);
             var chatSQL="INSERT INTO chat (chatID, fromName, content, chatTime) values ('"+parentID+"', '"+data.handle+"','"+data.message+"', NOW() );";
            pool.connection.query(chatSQL, function (error, results) {
                if (error)
                    throw error;
            });
            io.sockets.emit('chat', data);

        });
    });
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });


});


module.exports = router;