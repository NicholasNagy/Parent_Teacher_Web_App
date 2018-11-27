var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var update = require('./functions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();


router.post('/', function(req,res, next){
    var postID = req.body.postID;
    var userID = req.body.WallID;
    var wallID = req.body.userID;
    var Fname = req.body.name;

    console.log('the post id is :'+postID);
    console.log('the user id is :'+userID);

    var insert = "INSERT INTO likepost (postID, userID, likes,dislike)  VALUES ('"+postID+"', '"+userID +"', '"+1+"','"+0+"');";


    var like = "UPDATE post SET likes = likes+1 WHERE postID = '"+postID+"';";

    var check=  "SELECT * FROM likepost WHERE userID = '"+userID+"' AND postID='"+postID+"';";

    var fix= "UPDATE likepost SET likes = 1 WHERE userID = '"+userID+"' AND postID='"+postID+"';";

    var fix1= "UPDATE likepost SET dislike = 0 WHERE userID = '"+userID+"' AND postID='"+postID+"';";





// if he didnt like, and pressed like then he should like and decremet the dislike to zero
// if he did like then dont add it to overall post
    pool.connection.query(check,function(err, result) {

        console.log(result);
        if(err) throw err;


        if(result.length==0){

            pool.connection.query(insert,function (err,result1) {

                console.log('insertion is completed');
                console.log(result1);

            });

            pool.connection.query(like,function(err, result){
                if(err) throw err;
                let newposts = new Promise(function(resolve, reject){
                    resolve(update.getWall(wallID, userID));
                });
                newposts.then(function(wall){
                    res.render('parenthomepage', wall);
                });
            });

        }
        else {

            console.log('the result likes value is '+ result[0].likes);

            if(result[0].likes== '1'){

                let newposts = new Promise(function(resolve, reject){
                    resolve(update.getWall(wallID, userID));
                });
                newposts.then(function(wall){
                    res.render('parenthomepage', wall);
                });


            }else{

                pool.connection.query(fix,function (err,result1) {

                    console.log('FIX SQL is completed');
                    console.log(result1);

                });
                pool.connection.query(fix1,function (err,result2) {

                    console.log('FIX1 SQL is completed');
                    console.log(result2);

                });

                pool.connection.query(like,function (err,result3) {

                    console.log('like SQL is completed');
                    console.log(result3);
                    if(err) throw err;
                    let newposts = new Promise(function(resolve, reject){
                        resolve(update.getWall(wallID, userID));
                    });
                    newposts.then(function(wall){
                        res.render('parenthomepage', wall);
                    });
                });


            }





        }









    });







});





module.exports = router;
