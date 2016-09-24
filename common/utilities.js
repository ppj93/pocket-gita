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