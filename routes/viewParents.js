var express = require('express');
var router = express.Router();
var DBconnect = require ('./dbConfig');


var pool = new DBconnect();


/* GET home page. */
router.post('/', function(req, res, next) {
    var sql= "SELECT * FROM Users WHERE isTeacher='0'";

    //sending the teacher's name from the teacher homepage
    var teachername = req.body.ffnam;
    var userID = req.body.userID;

    pool.connection.query(sql,(err,result)=> {
        if (err) {
            throw err;
        }
        res.render('viewParent', { parents: result, teacher: teachername, userID:userID});
    });

});

module.exports = router;
