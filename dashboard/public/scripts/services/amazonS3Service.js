(function () { 
    'use strict';

    angular.module('services').factory('amazonS3Service', ['utilityService', '_', '$q', 'appConfig',
        function (utilityService, _, $q, appConfig) {
        var service = {};

        var cache = utilityService.createNewOrGetExistingCache('amazonS3Data');
        
        var s3 = new AWS.S3();

        s3.config.update({
            accessKeyId: '',
            secretAccessKey: '',
            region:'ap-south-1',
            signatureVersion: 'v4'
        });

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