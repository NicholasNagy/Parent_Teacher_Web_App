var serverr = require('../app');
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var socket = require('socket.io');
var router = express.Router();

app.use(express.static('public'));

router.post('/', function(req, res) {
    res.render('messenger', {title: 'Express'});

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
// Socket setup & pass server

});


module.exports = router;