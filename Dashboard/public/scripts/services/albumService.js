(function () { 
    'use strict';

    angular.module('services').factory('albumService', ['$q', '$http', 'uuidService', 'serviceUrls', 'utilityService', 
        function ($q, $http, uuidService, serviceUrls, utilityService) {
        var service = {};

        
        service.getAlbums = function () {
            var request = {
                requestBase: {
                    requestId: uuidService.v1()
                }
            };
            return $http.post(serviceUrls.getAlbums, request).then(function (response) {
                var data = response.data;
                /**
                 * Always use === and !== for comparison. Check google for reason.!
                 */
                if (data.result.code !== 0) {
                    return $q.reject(data.result);
                }

                return data.albums;

            }, utilityService.handleNetworkError);
        };
            
        service.addAlbum = function (album) {
            var request = {
                requestBase: {
                    requestId: uuidService.v1()
                },
                album: album
            };
            return $http.post(serviceUrls.addAlbum, request).then(function (response) {
                var data = response.data;
                /**
                 * Always use === and !== for comparison. Check google for reason.!
                 */
                if (data.result.code !== 0) {
                    return $q.reject(data.result);
                }

                return;

            }, utilityService.handleNetworkError);
  
        };
            
        return service;
    }]);
})();