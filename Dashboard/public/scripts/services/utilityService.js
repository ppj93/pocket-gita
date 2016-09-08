(function () {
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
        
    }]);
})();