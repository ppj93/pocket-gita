(function () { 
    'use strict';

    angular.module('services').factory('amazonS3Service', ['$http', 'serviceUrls', 'utilityService', '_', '$q', 'appConfig',
        function ($http, serviceUrls, utilityService, _, $q, appConfig) {
        var service = {};

        var cache = utilityService.createNewOrGetExistingCache('amazonS3Data');
        
        var s3 = new AWS.S3();
            
        service.initializeS3Client = function () { 
            return $http.get(serviceUrls.getAmazonS3Credentials).then(function (response) {
                var data = response.data;

                if (data.result.code !== 0) {
                    return $q.reject(data.result);
                }
                
                var credentials = data.credentials;
                
                s3.config.update({
                    accessKeyId: credentials.accessKeyId,
                    secretAccessKey: credentials.secretAccessKey,
                    region:'ap-south-1',
                    signatureVersion: 'v4'
                });

             }, utilityService.handleNetworkError);            
        };            
        service.getS3Tracks = function () { 
            //Foll returns Cache object identified by the cacheId or undefined if no such cache.
            if (cache.get('tracks')!== undefined) {
                return $q.resolve(cache.get('tracks'));
            }
            return s3.listObjectsV2({Bucket: appConfig.amazonS3BucketName, Prefix: 'tracks/'}).promise().then(function(data){
                var tracksWithoutFolderEntry = _.reject(data.Contents, function (track) { return track.Key === 'tracks/'; });
                
                var decoratedTracks = _.map(tracksWithoutFolderEntry, function (track) { return {fileName: track.Key.substring(7, track.Key.length)}; })
                
                cache.put('tracks', decoratedTracks);
                return $q.resolve(decoratedTracks);
            }, function (error) { 
                return $q.reject(error);
            });
        };
        
        return service;
    }]);
})();