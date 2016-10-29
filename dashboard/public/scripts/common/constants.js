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
                unableToFetchAmazonS3Tracks: 'Not able to fetch tracks from amazon s3. Contact dev team.',
                networkError: 'Network error occurred. Check your internet connection, refresh & contact dev team if still not working.',
                unableToAddTrackAmazonS3: 'Error occurred adding track to amazon S3. Try again & contact dev team if still not working.'
            },
            amazonS3UrlBase: 'https://{bucket}.s3.amazonaws.com/{key}'
        })
})();