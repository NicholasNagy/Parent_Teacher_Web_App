var http = require("http");

//to sereve the html file
var fs = require("fs");

var express = require('express');
var mysql = require('mysql');
const fun = require("./functions")
//to decode the url
//var urldecode = require("decodeuricomponent")

http.createServer(function(req, res) {

    if(req.method === "GET"){
       res.writeHead(200, {"Content-Type": "text/html"});
      fs.createReadStream("signup.html", "UTF-8").pipe(res);
    }else if (req.method === "POST"){

        var body = "";

        req.on("data", function(chunk){
            body += chunk;
        });

       // var body2 = req
       // The stringfy method turns the require body into a string
            // so it can be passed for myDecodeFunction that splits the String into an array
      dataString = JSON.stringify(body);
      dataArray = fun.splitFunction(dataString);

       var connection = mysql.createConnection({
          host : 'localhost',
          user : 'root',
          password : 'password',
          database : 'dbname'
        });
        var Fname = "'"+body+"'";
        var Lname=dataArray[1];
        var email=dataArray[2];
        var sql = "INSERT INTO Parent (Fname) VALUES ("+Fname+")";

        connection.connect(function(err){
          if(err) console.log(err.stack);
          console.log("Connected!");
          connection.query(sql, function (err, result){
            if (err) throw err;
            console.log("Result: " + result);

          });
        });
        // var decodebody = "";
       // decodebody += urldecode(urlbody);

        req.on("end", function(){

            res.writeHead(200, {"Content-Type": "text/html"});

            res.end(`

            <!DOCTYPE html>
            <html>
                <head>
                <title>Hello</title>
                </head>

                <body>
                <p>home page</p>
                </body>

            </html>

            `);
        });
    }

}).listen(5000);

console.log("form server is listining on port 5000");
