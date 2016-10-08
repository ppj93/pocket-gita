(function () { 
    'use strict';

    angular.module('services').factory('trackService', ['$q', '$http', 'uuidService', 'serviceUrls', 'utilityService', 
        function ($q, $http, uuidService, serviceUrls, utilityService) {
        var service = {};

        
        service.getTracks = function () {
            var request = {
                requestBase: {
                    requestId: uuidService.v1()
                }
            };
            return $http.post(serviceUrls.getTracks, request).then(function (response) {
                var data = response.data;
                /**
                 * Always use === and !== for comparison. Check google for reason.!
                 */
                if (data.result.code !== 0) {
                    return $q.reject(data.result);
                }

                return data.tracks;

            }, utilityService.handleNetworkError);
        };
            
        service.addTrack = function (track) {
            var request = {
                requestBase: {
                    requestId: uuidService.v1()
                },
                track: track
            };
            return $http.post(serviceUrls.addTrack, request).then(function (response) {
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
            
        service.editTrack = function (track) {
            var request = {
                requestBase: {
                    requestId: uuidService.v1()
                },
                track: track
            };
            return $http.post(serviceUrls.editTrack, request).then(function (response) {
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