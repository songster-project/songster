angular.module('songster.event.services', []);

angular
    .module('songster.event', [
        'songster.event.services',
        'ui.router',
        'songster.menu'
    ]);