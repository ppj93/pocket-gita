/* Before declaring a module, declare its dependency */

angular.module('PocketGita.Constants', []);

angular.module('PocketGita.Config', []);

angular.module('PocketGita.Services', [
    'PocketGita.Constants', 'PocketGita.Config'
]);

angular.module('PocketGita.Filters', [
    'PocketGita.Constants',
    'PocketGita.Config'
]);

angular.module('PocketGita.Controllers', [
    'PocketGita.Filters',
    'PocketGita.Services',
    'PocketGita.Constants',
    'PocketGita.Config'
]);

angular.module('PocketGita', ['PocketGita.Controllers', 'PocketGita.Directives']);