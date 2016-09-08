(function () { 
    angular.module('services').factory('albumService', ['$q', '$http', 'uuidService', 'serviceUrls', 'utilityService', 
        function ($q, $http, uuidService, serviceUrls, utilityService) {
        var service = {};

        
        service.getAlbumList = function () {
            var request = {
                requestBase: uuidService.c1()
            };
            return $http.post(serviceUrls.getAlbumList, request).then(function (response) {
                /**
                 * Always use === and !== for comparison. Check google for reason.!
                 */
                if (response.result.code !== 0) {
                    return $q.reject(response.result);
                }

                return response.albumList;
                
            }, utilityService.handleNetworkError);
        };
            
        return service;
    }]);
})();