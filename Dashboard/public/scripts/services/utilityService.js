(function () {
    'use strict';

    angular.module('services').factory('utilityService', ['$q', function ($q) { 
        var service = {};

        service.handleNetworkError = function (error) {
            /**
             * TODO: DO logging here
             */
            return {
                message: "Network error occurred."
            };
        };

        service.constructMessageObject = function (type, text) {
            return {
                type: type,
                text: text
            };
        };
        return service;
    }]);
})();