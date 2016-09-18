var mongoose = require('mongoose');

var db = undefined;

module.exports = {
    connectToDb: function (errorCb, successCb) {
        if (!db) {
            mongoose.connect('mongodb://localhost/test');
            var newDb = mongoose.connection;
            db = newDb;    
            db.on('error', errorCb);
            db.once('open', function () { 
                successCb(db);
            });
        }
        else {
            successCb(db);
        }
    },

    getDb: function () {
        return db;
    }
};
