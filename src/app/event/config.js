angular
    .module('songster.event')

    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Create Event', 'fa-cloud-upload', 'event', 500);
    }]);