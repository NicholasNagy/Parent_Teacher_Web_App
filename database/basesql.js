var mysql = require('mysql');


var connection = mysql.createConnection({
   host : 'localhost',
   user : 'root',
   password : 'password',
   database : 'dbname'
 });
 //creating the sql query to insert the data into the proper table
 var sql = "INSERT INTO Parent (Fname, Lname, Email, ChildID, Pass) VALUES ('"+dataArray[0]+"', '" + dataArray[1]+"', '"+dataArray[2]+"', '"+dataArray[3]+"', '"+dataArray[4]+"')";

 //connecting to sql database to use the query
 connection.connect(function(err){
   if(err) console.log(err.stack);
   console.log("Connected!");

   //below is the query function, which prints the result if there is one (to the console)
   connection.query(sql, function (err, result){
     if (err) throw err;
     console.log("Result: " + result);

   });
 });
