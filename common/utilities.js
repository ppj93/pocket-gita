var config = require('../config'),
    operationResults = require('../common/constants').operationResults;

exports.getUiJsonResponseSender = function (response) {
    return function (error, result) {
        if (error) {
            response.json(error);
        }
        else {
            response.json(result);
        }
    };
};

exports.checkIfUserIsAuthorized = function (extras, callback) {
    if (!config.userLoggedIn) {
        callback({
            result: operationResults.accessDeniedUserUnauthorized
        });
        return;
    } 

    callback(null, extras);
};