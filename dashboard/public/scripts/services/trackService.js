(function () { 
    'use strict';

    angular.module('services').factory('trackService', ['_', 'constants', 'albumService', '$q', '$http', 'uuidService', 'serviceUrls', 'utilityService',
    'amazonS3Service', function (_, constants, albumService, $q, $http, uuidService, serviceUrls, utilityService, amazonS3Service) {
        var service = {};

        var cache = utilityService.createNewOrGetExistingCache('albumAndTrackLists');

        var populateAlbumIdUsingAlbumName = function (track) {
            if (!track.album || !track.album.name) {
                return $q.resolve({});
            }

            return albumService.searchAlbumByNameExactMatch(track.album.name).then(function (album) { 
                if (!album) {
                    return $q.reject({
                        message: constants.messages.albumNotFoundInDb
                    });
                }

                track.album.id = album.id;
                return album;
            }, function (error) {
                return $q.reject(error);
            });
        };
           
        service.searchTrackByNameExactMatch = function (name) {
            return service.searchTrackByName(name).then(function (tracks) {
                return _.find(tracks, function (testTrack) { return testTrack.name === name; });
            }, function (error) { 
                return error;
             });  
        };
            
        service.searchTrackByName = function (name) {
            var nameMatcher = function (testTrack) {
                return testTrack.name.indexOf(name) >= 0;  
            };

            return service.getTracks(false).then(function (tracks) { 
                return _.filter(tracks, nameMatcher);
            }, function (error) { 
                return error;
            });
        };

        service.getTracks = function (refreshCache) {
            if (!refreshCache && cache.get('tracks')) {
                return $q.resolve(cache.get('tracks'));
            }

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

                cache.put('tracks', data.tracks);                
                return data.tracks;

            }, utilityService.handleNetworkError);
        };
            
        service.addTrack = function (track) {
            cache.removeAll();

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
            cache.removeAll();

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
  
        service.searchAudioUrl = function (name) {
            return amazonS3Service.getS3Tracks().then(function (tracks) { 
                var x = _.filter(tracks, function (track) {
                    if (!track.fileName.endsWith('.mp3')) { 
                        return false;
                    }

                    var fileNameWithoutMp3Extension = track.fileName.substring(0, track.fileName.length - 3);
                    return fileNameWithoutMp3Extension.indexOf(name) > -1;
                });

                return x;
            }, function (error) {
                return $q.reject({ message: constants.messages.unableToFetchAmazonS3Tracks });
            });
        };
            
        return service;
    }]);
})();