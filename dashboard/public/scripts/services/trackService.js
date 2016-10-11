(function () { 
    'use strict';

    angular.module('services').factory('trackService', ['constants', 'albumService', '$q', '$http', 'uuidService', 'serviceUrls', 'utilityService', 
        function (constants, albumService, $q, $http, uuidService, serviceUrls, utilityService) {
        var service = {};

               
        var populateAlbumIdUsingAlbumName = function (track) {
            return albumService.searchAlbumByNameExactMatch(track.album.name).then(function (album) { 
                if (!album) {
                    return $q.reject({
                        message: constants.messages.albumNotFoundInDb
                    });
                }

                track.album.id = album.id;
                return album;
            }, function (error) {
                return error;
            });
        };
           
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
            
        service.getTrackDetails = function (id) {
            var request = {
                requestBase: {
                    requestId: uuidService.v1()
                },
                id: id
            };
            return $http.post(serviceUrls.getTrackDetails, request).then(function (response) {
                var data = response.data;
                /**
                 * Always use === and !== for comparison. Check google for reason.!
                 */
                if (data.result.code !== 0) {
                    return $q.reject(data.result);
                }

                return data.track;

            }, utilityService.handleNetworkError);
        };
            
        service.editTrack = function (track) {
            var executeEditTrack = function () {
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

            return populateAlbumIdUsingAlbumName(track)
                .then(executeEditTrack,
                function (error) {
                    return $q.reject(error);
                }
            );

        };
  
        return service;
    }]);
})();