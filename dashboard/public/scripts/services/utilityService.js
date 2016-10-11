(function () {
    'use strict';

    angular.module('services').factory('utilityService', ['$q', '$cacheFactory', function ($q, $cacheFactory) { 
        var service = {};

        service.handleNetworkError = function (error) {
            /**
             * TODO: DO logging here
             */
            return $q.reject({
                message: "Network error occurred."
            });
        };

        service.constructMessageObject = function (type, text) {
            return {
                type: type,
                text: text
            };
        };

        service.createNewOrGetExistingCache = function (cacheId) {
            if (!$cacheFactory.get(cacheId)) {
                return $cacheFactory(cacheId);
            } 
            return $cacheFactory(cacheId);
        };

        return service;
    }]);
})();