angular
    .module('songster.eventService', [
        'ui.router',
        'placeholders',
        'ui.bootstrap',
        'songster.menu'
    ]);

angular
    .module('songster.event', [
        'ui.router',
        'placeholders',
        'ui.bootstrap',
        'songster.eventService',
        'songster.menu'
    ]);