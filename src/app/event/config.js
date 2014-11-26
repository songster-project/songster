angular
    .module('songster.event')

    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Event', 'fa-bullhorn', 'event', 499);
    }]);