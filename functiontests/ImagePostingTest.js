var mysql = require('mysql');
var DBconnect = require('../routes/dbConfig');
//var pool = new DBconnect();

var functions = require('../routes/functions');
var pool = new DBconnect();



//Promise that image is posted with text
let imagePostWithTextPromise = new Promise((resolve, reject) => {
  resolve(functions.post("Test with post content", "2", "2", "test-Image.png"));
});


var imagePostSQL = "SELECT Content, WallID, PosterID, Image FROM post where WallID='2' AND PosterID='2' AND Content='Test with post content' AND Image='test-Image.png';";

imagePostWithTextPromise.then((successMessage) => {
  console.log(successMessage);

  pool.connection.query(imagePostSQL, function(err, results){
    if(err) throw err;

    //If SQL select statement returns some results
    if(results.length>0){

      //Check if those results are valid, if so, the test is successful.
      if(results[0].Content=="Test with post content" && results[0].WallID=="2" && results[0].PosterID=="2" && results[0].Image=="test-Image.png"){
          console.log("Posting image was successful");
          process.exit(0);
      }
      else{
          console.log("Posting image has failed");
          process.exit(1);
      }

    }
    else{
      console.log("No results were found");
      process.exit(2);
    }
  });

});