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

exports.checkIfUserIsAuthorized = function (params, callback) {
    var request = params.request;
    if (!request.session.passport || !request.session.passport.user) {
        callback({
            result: operationResults.accessDeniedUserUnauthorized
        });
        return;
    } 

    callback(null, params);
};