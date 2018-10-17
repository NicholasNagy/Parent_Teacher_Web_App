var serverr = require('../app');
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var socket = require('socket.io');
var router = express.Router();

app.use(express.static('public'));

router.post('/', function(req, res) {
   // var naming = req.body.parent_name[0];
    //we test if the name is from a teacher name or a parent name

    if (req.body.teacher_name == undefined)
       var naming = req.body.ffnam + " -Parent";

   else
       var naming = req.body.teacher_name + " -Teacher";
    //var naming = req.body.parent_name;

    res.render('messenger', {nm: naming});

    app.use(express.static('public'));
    var io = socket(serverr.servers);
    //server.listen(3001);
    //var io = require('socket.io').listen(serverr.servers);
    io.on('connection', (socket) => {
        console.log('made socket connection', socket.id);
        socket.on('chat', function(data){
             console.log(data);
            io.sockets.emit('chat', data);
        });
    });
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });


});


module.exports = router;