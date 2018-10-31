var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require('./dbConfig');
var functions = require('./functions');
var path = require('path');
var fs = require('fs');

var multer = require('multer');
var mv = require('mv');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();





router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

//HANDLE POSTING HERE
router.post('/', function (req,res) {

var imageName = '';

  const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      var date = new Date().toDateString();
      var fileFullName = path.basename(file.originalname).toString() ;
      var fileBaseName = fileFullName.substring(0, fileFullName.lastIndexOf('.'));
      var fileExtension = path.extname(file.originalname);
      //console.log(date);
      //cb(null, path.basename(file.originalname) + path.extname(file.originalname));
     cb(null,  date + '-' +  fileBaseName + fileExtension);
    imageName = date + '-' +  fileBaseName + fileExtension;
    }
  });

  const upload = multer({
    storage: storage,
    limits: {fileSize: 1024*1024*10},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('userImageEdit');


  //check File Type Function
  function checkFileType(file, cb){
    //Allowed ext
    const filetypes = /jpeg|jpg|png/;
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // chick mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
      return cb(null, true);
    }else{
      cb('Error: images only!');
    }
  }




  upload(req, res,(err) => {

  //GET ALL VARIABLE SUBMITTED
    var post = req.body.textPost;
    var WallID= req.body.WallID;
    var PosterID= req.body.PosterID;
    var theName= req.body.name;
    var file = req.file;
    console.log(file);

   if(file == undefined){
    imagePath = undefined;
   }

   console.log(imageName);


    let thepost = new Promise(function(resolve, reject){
      resolve(functions.post(post, WallID, PosterID, imageName));
    });

    thepost.then(function(successMessage){
      console.log(successMessage);
      //NEW SELECT STATEMENT TO DISPLAY THE PROPER POSTS FOR THE INDIVIDUAL
      var posts = "SELECT Content, postID, Image FROM post where WallID='"+WallID+"';";
      //EXECUTION OF QUERY
      pool.connection.query(posts, function (error, results) {
          if (error)
              throw error;
            //RENDERING HOMEPAGE AFTER POSTING HAS BEEN DONE
          res.render('parenthomepage', {posts: results, name:theName, WallID:WallID, userID:PosterID});
      });
    });

  });


});

module.exports=router;
