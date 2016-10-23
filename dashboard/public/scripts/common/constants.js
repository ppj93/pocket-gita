(function () {
    'use strict';
    angular.module('constants')
        .constant('constants', {
            messageTypes: {
                error: "error",
                success: "success"
            },
            actions: {
                add: 'add',
                edit: 'edit'
            },
            messages: {
                albumNotFoundInDb: 'Album name you have entered does not exist. Please search for album name & select from available options.',
                unableToFetchAmazonS3Tracks: 'Not able to fetch tracks from amazon s3. Contact dev team.'
            }
        })
})();