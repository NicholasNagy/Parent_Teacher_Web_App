var express = require('express');
var router = express.Router();
var DBconnect = require ('./dbConfig');


var pool = new DBconnect();


/* GET home page. */
router.post('/', function(req, res, next) {
    var sql= "SELECT Fname,Lname FROM parents";
    pool.connection.query(sql,(err,result)=> {

        if (err) {
            throw err;
        }
        res.render('viewParent', { parents: result });
    });

});

module.exports = router;
