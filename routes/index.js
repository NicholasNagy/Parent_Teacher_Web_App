var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connects to heroku online database
var connection = mysql.createConnection({

    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'b2af4a2e0e0550',
    password: '6424a2d3',
    database: 'heroku_1f20bf2d1e8055d'
});
/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});



//signup for parents
router.post('/signup', function(req,res){
    if(req.body.account==="parent"){
        //initializing variables
        var fName=req.body.firstName;
        var lName=req.body.lastName;
        var ChildID=req.body.childID;
        var Email=req.body.email;
        var pass = req.body.password;


        //creating queries, first one checks to see if there are any emails that
        //are the same the second inserts the data into the database
        var query = "SELECT Email FROM Parents where Email='"+ Email+"';";
        var sql = "INSERT INTO  Parents (Fname, Lname, Email, ChildID, Pass) VALUES ('"+fName+"','"+lName+"', '"+Email+"', '"+ChildID+"', '"+pass+"')";

        //connecting to sql database to use the query
        connection.connect(function(err){
            if(err) console.log(err.stack);
            console.log("Connected!");

            //below the query checks to see if any of the same emails exist
            //if they do, the method ends
            connection.query(query, function(err, result){
                if(err) throw err;

                if(result.length>0){//checks to see if any results with the same email
                    //turned up
                    console.log("email is already in use");
                    //HANDLE EMAIL ALREADY IN USE CASE HERE
                    res.end();
                }
                else{
                    //if none were found, data is inserted into database
                    connection.query(sql, function (err, result){
                        if (err) throw err;
                        console.log("Result: " + result);
                        //below the homepage is rendered
                        //HANDLE BEING SENT TO HOMEPAGE HERE
                        var posts = "SELECT Content FROM posts";
                        connection.query(posts, function (error, results) {
                            if (error)
                                throw error;
                            res.render('parenthomepage', {posts: results});
                        });

                    });
                }
            });
        })
    }
    else{
        //signup for teachers
        //assigning variable names
        var fName=req.body.firstName;
        var lName=req.body.lastName;
        var ClassID=req.body.classID;
        var Email=req.body.email;
        var pass = req.body.password;

        //making sql queries, the first one is used for checking emails, the second
        //for signup
        var query = "SELECT Email FROM Teachers where Email='"+ Email+"';";
        var sql = "INSERT INTO  Teachers (Fname, Lname, Email, ClassID, Pass) VALUES ('"+fName+"','"+lName+"', '"+Email+"', '"+ClassID+"', '"+pass+"')";

        //connection for sql querying
        connection.connect(function(err){
            if(err) console.log(err.stack);
            console.log("Connected!");

            //making the first sql query to check for any of the same email in the
            //database
            connection.query(query, function(err, result){
                if(err) throw err;
                if(result.length>0){//checks to see if the result of the query
                    //had any results
                    console.log("email is already in use");//if it did, email is in use
                    //HANDLE EMAIL ALREADY IN USE HERE
                    res.end();
                }
                else{
                    //else the insertion query is performed, and homepage rendered
                    connection.query(sql, function (err, result){
                        if (err) throw err;
                        console.log("Result: " + result);
                        //HANDLE BEING SENT TO HOMEPAGE HERE
                        res.render('parenthomepage', { title: 'Express' });
                    });
                }
            })
        });
    };


});


router.post('/login', function(req,res){
    //initializing the variables
    var email=req.body.email_logIn;
    var pass = req.body.password_logIn;

    //make querying statements, first one searches through the Parents table for
    //the same email and password, while the other searches through the teachers table
    var sql = "SELECT Email, Pass, Fname from Parents where Email='"+email+"' and Pass='"+pass+"';";
    var thesql= "SELECT Email, Pass from Teachers where Email='"+email+"' and Pass='"+pass+"';";

    //connecting to mysql database for querying
    connection.connect(function(err){
        if(err) console.log(err.stack);
        console.log("Connected!");
        var x =0;
        //below checks the query for the same email and password
        connection.query(sql, function (err, result){
            if (err) throw err;
            //underneath is the boolean for it
            if(result.length>0){
                if(result[0].Email==email&&result[0].Pass==pass){
                    console.log("Login Successful");
                    var posts = "SELECT Content FROM posts";
                    connection.query(posts, function (error, results) {
                        if (error)
                            throw error;
                        res.render('parenthomepage', {posts: results, name: result});
                    });
                    //if successful, renders homepage
                    //HANDE BEING SENT TO HOMEPAGE HERE
                    //res.render('parenthomepage', {title: 'Express'}); //this handles posting comments
                    router.post('/posting', function (req,res) {
                        var post = req.body.parentPost;
                        var postSQL = "INSERT INTO posts (content) VALUES ('"+post+"')";
                        connection.query(postSQL, function (err, result) {
                            if (err)
                                throw err;
                            console.log("Post is added to DB");
                            var posts = "SELECT Content FROM posts";
                            connection.query(posts, function (error, results) {
                                if (error)
                                    throw error;
                                res.render('parenthomepage', {posts: results});
                            });


                        });
                    });

                }
            }

            else{
                console.log("unsuccessful parent login");
                x++;
            };

        });
        //below checks the query for the same email and password
        connection.query(thesql, function (err, result){
            if(err) throw err;
            //underneath is the boolean for it
            if(result.length>0){
                if(result[0].Email==email&&result[0].Pass==pass){
                    console.log("Login Successful");
                    //if successful, renders homepage
                    //HANDLE BEING SENT TO HOMEPAGE HERE
                    res.render('parenthomepage', {title: 'Express'});
                }
            }
            else{
                console.log("unsuccessful teacher login");
                x++;
            }
        });

        if(x==2){
            /*HANDLE INCORRECT EMAIL AND PASSWORD LOGIN HERE*/
        }
    });

});





module.exports = router;
