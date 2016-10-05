var mongoose = require('mongoose'),
    operationResults = require('./constants');    

module.exports = {
    connectToDb: function (callback) {
        //TODO: move connection string to config
        mongoose.connect('mongodb://localhost/test1');
        var db = mongoose.connection;
        db.on('error', function (error) {
            /* Log error details here */
            callback({
                result: operationResults.problemConnectingToDb
            });    
            return;
        });
        
        db.on('connected', function (ref) { callback(null, ref); } );
    }
};
