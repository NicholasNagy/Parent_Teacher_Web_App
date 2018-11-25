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

    var tagged1 = req.body.taggedFriend0;
    var tagged2 = req.body.taggedFriend1;
    var tagged3 = req.body.taggedFriend2;
    var tagged4 = req.body.taggedFriend3;
    var tagged5 = req.body.taggedFriend4;

    console.log("tagged:"+tagged1);
    console.log("tagged2:"+tagged2);
    console.log("tagged5:"+ tagged5);
    console.log(file);

   if(file == undefined){
    imagePath = undefined;
   }

   console.log(imageName);




    let thepost = new Promise(function(resolve, reject){

        resolve(functions.post(post,WallID,PosterID,imageName,tagged1,tagged2,tagged3,tagged4,tagged5));
      

    });

    thepost.then(function(successMessage){
      console.log(successMessage);
      //NEW SELECT STATEMENT TO DISPLAY THE PROPER POSTS FOR THE INDIVIDUAL

      let getWallPosts = new Promise(function(resolve, reject){
        resolve(functions.getWall(WallID, PosterID));
      });

      getWallPosts.then(function(wall){
        res.render('parenthomepage', wall);
      });

    });

  });


});

module.exports=router;
