const environment = process.env.NODE_ENV
const Config = require('./config-database');

var env_config = new Config();

// This will be in some JSON config we'll say
var dbOptions = {
    port: env_config.db.port,
    host: env_config.db.host,
    database: env_config.db.database,
    user: env_config.db.user,
    password: env_config.db.password,
};

//This will depend on which version/module/db you're using, but here's what mine looks like
var MySQL = require("mysql2");
// var config = require("../configs/db.json");
// connectionPool = MySQL.createPool({host: config.db_config.host, ...});
var connectionPool = MySQL.createPool(dbOptions);

connectionPool.getConnection(function (err, connection) {
    console.log('environment config => ', env_config);
    if (err) {
        console.log('Error connecting to mysql Db: ', err);
        return;
    }
    console.log('Connected to mysql db!');
    // connectionPool.getConnection(connection);
});

// module.exports = connectionPool;
module.exports = connectionPool.promise();
