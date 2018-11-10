var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var functions = require('./functions');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();

router.get('/', function(req,res) {
    //initializing the variables
    res.render('forgotPassword');
});


 router.post('/', function(req,res) {
     //initializing the variables
     var e= req.body.email_reset;
     console.log(e);
     var query1= "SELECT Pass FROM users where Email='"+ e+"';";
     pool.connection.query(query1, function(err, result){
         if(err) throw err;
            console.log(result);

        if(result.length>0){

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'baraka.khalid4@gmail.com',
                    pass: 'kb5145783905kb'
                }
            });
            var forgotton =JSON.stringify(result[0].Pass)
            var mailOptions = {
                from: 'baraka.khalid4@gmail.com',
                to: e,
                subject: 'Sending Email using Node.js',
                text: 'That was easy'+ ' the password is '+ forgotton
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

        }else{

           console.log('not found!');

        }

     });




     res.render('forgotPassword');
 });








// });










module.exports=router;
