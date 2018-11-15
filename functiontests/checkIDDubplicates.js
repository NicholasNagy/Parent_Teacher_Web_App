var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var DBconnect = require('../routes/dbConfig');
var signup = require('../routes/signup');
var login = require('../routes/functions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = new DBconnect();

let getDuplicates = new Promise(function(resolve, reject){
    var userdata = "SELECT * FROM Users;";

    pool.connection.query(userdata, function(err, users){
        if(err) throw err;
        var x = 0;
        var i = 0;
        var duplicates = 0;
        var duplicateID = new Array();
        while(x<users.length){
            i = x+1;
            while(i<users.length){
                if(users[i].ID==users[x].ID){

                    console.log("Duplicates found for ("+users[x].isTeacher+") ID = " +users[x].ID+" and for ("+users[i].isTeacher+") ID = " +users[i].ID);
                    console.log("Deleting account ID: "+ users[i].ID);
                    duplicateID[duplicates] = users[i].ID;
                    duplicates++;

                }
                i++;
            }
            x++;
        }

        console.log(duplicates + " duplicates found");
        resolve(duplicateID);

    });
});

var deleteuser = function(user){
    return new Promise(function(resolve, reject){
        var deleteuser = "DELETE FROM Users WHERE ID='"+user+"';";
        pool.connection.query(deleteuser, function(error, noresult){
            if(error) throw error;
            resolve();
        });
    });
}

getDuplicates.then(function(duplicates){
    for(i=0;i<duplicates.length;i++){
        deleteuser(duplicates[i]);
    }

    if(duplicates.length>0){
        console.log("Exiting with exit code 1");
        process.exit(1);
    }
    else {
        console.log("Exiting with exit code 0");
        process.exit(0);
    }


});
