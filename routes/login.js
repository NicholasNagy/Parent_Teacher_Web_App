var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require ('./dbConfig');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();



router.post('/', function(req,res){
    //initializing the variables
    var email=req.body.email_logIn;
    var pass = req.body.password_logIn;

    //make querying statements, first one searches through the Parents table for
    //the same email and password, while the other searches through the teachers table
    var sql = "SELECT Email, Pass, Fname, Lname, isTeacher, ID from Users where Email='"+email+"' and Pass='"+pass+"';";


    //below checks the query for the same email and password
    pool.connection.query(sql, function (err, result){
        if (err) throw err;
        //underneath is the boolean for it

        if(result.length>0){

            if(result[0].Email==email&&result[0].Pass==pass){

                console.log("Login Successful");
                var posts = "SELECT Content, postID FROM post where WallID='"+result[0].ID+"';";
                pool.connection.query(posts, function (error, results) {

                    if (error)
                        throw error;

                    var thename=result[0].Fname;
                    // this variable is hidden in the homepage and will be used later to
                    // collect data when routing to other pages
                    var theID=result[0].ID;
                    console.log(theID);


                    if(result[0].isTeacher==0) {
                        res.render('homepage', {posts: results, name: thename, userID: theID});
                        console.log("parenthomepage");
                    }
                    else{
                        res.render('parenthomepage', {posts: results, name:thename, WallID:theID, PosterID:theID, userID: theID});
                        console.log("teacherhomepage");
                    }
                });
            }
        }

        else{
            console.log("unsuccessful login");
            res.send("unsuccessful login");
        };

    });


});




module.exports=router;
