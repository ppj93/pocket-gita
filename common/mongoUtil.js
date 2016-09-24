var mongoose = require('mongoose');

var db = undefined;

module.exports = {
    connectToDb: function (callback) {
        if (!db) {
            //TODO: move connection string to config
            mongoose.connect('mongodb://localhost/test1');
            var newDb = mongoose.connection;
            db = newDb;    
            db.on('error', function (error) {
                callback(error, null);    
            });
            
            db.once('open', function () { 
                callback(null, db);
            });
        }
        else {
            callback(null, db);
        }
    },

    getDb: function () {
        return db;
    }
};
