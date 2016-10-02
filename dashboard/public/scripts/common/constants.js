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
            }
        })
})();