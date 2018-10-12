var mysql = require ('mysql');

class CreatePool{
    constructor() {

        this.connection = mysql.createPool({

            connectionLimit: 20,
            host: 'us-cdbr-iron-east-01.cleardb.net',
            user: 'b2af4a2e0e0550',
            password: '6424a2d3',
            database: 'heroku_1f20bf2d1e8055d'
        });
    }
}

module.exports = CreatePool;
