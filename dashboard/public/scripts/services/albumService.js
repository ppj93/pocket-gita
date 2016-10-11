(function () { 
    'use strict';

    angular.module('services').factory('albumService', ['_', '$q', '$http', 'uuidService', 'serviceUrls', 'utilityService', 
        function (_, $q, $http, uuidService, serviceUrls, utilityService) {
        var service = {};

        var cache = utilityService.createNewOrGetExistingCache('albumAndTrackLists');
        

        service.getAlbums = function (refreshCache) {
            if (!refreshCache && cache.get('albums')) {
                return $q.resolve(cache.get('albums'));
            }

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

                cache.put('albums', data.albums);
                return data.albums;

            }, utilityService.handleNetworkError);
        };
            
        service.searchAlbumByName = function (name) {
            var nameMatcher = function (testAlbum) {
                return testAlbum.name.indexOf(name) >= 0;  
            };
            
            if (cache.get('albums')) {
                return $q.resolve(_.filter(cache.get('albums'), nameMatcher));
            }

            return service.getAlbums(true).then(function (albums) { 
                return _.filter(albums, nameMatcher);
            }, function (error) { 
                return error;
            });
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
            
        service.editAlbum = function (album) {
            var request = {
                requestBase: {
                    requestId: uuidService.v1()
                },
                album: album
            };

            cache.removeAll();

            return $http.post(serviceUrls.editAlbum, request).then(function (response) {
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