(function () {
    'use strict';
    /* Before declaring a module, declare its dependency */

    angular.module('constants', []);

    angular.module('config', ['ui.router']);

    angular.module('directives', [
        'constants'
    ]);

    angular.module('services', [
        'constants', 'config'
    ]);

    angular.module('filters', [
        'constants',
        'config'
    ]);

    angular.module('controllers', [
        'filters',
        'services',
        'constants',
        'config'
    ]);

    /* Make sure u include directives in dependent modules below. else none of the directives
    will work */
    angular.module('pocketGita', ['controllers', 'config', 'directives']);
})();
