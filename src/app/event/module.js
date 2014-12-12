angular.module('songster.event.services', []);

angular
    .module('songster.eventService', [
        'ui.router',
        'placeholders',
        'ui.bootstrap',
        'songster.menu'
    ]);

angular
    .module('songster.event', [
        'songster.event.services',
        'ui.router',
        'songster.eventService',
        'songster.menu'
    ]);