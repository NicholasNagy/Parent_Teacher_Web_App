//how to use this file:
//simply create your html file, and if you want to acces what
//it looks like through the browser window, go into your browser
//and type in localhost:8080/filename.html
//where filename is the name of your html file.
//Note: this only works if the file is in the same directory as this one.

var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {//creates the server
  var q = url.parse(req.url, true);//this parses the url as an object to be able to read it
  var filename = "." + q.pathname;//this is to access the file through the web browser
  fs.readFile(filename, function(err, data) {//read file function from fs module
    if (err) { //catching an error, so that's why at localhost:8080 there is a 404 error
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
    //file contents are added to page here
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(8080);//adds server to your computer's 8080 port


//Taken from https://www.w3schools.com/nodejs/nodejs_url.asp
//on September 22nd 2018
