angular
    .module('songster.event-songs')

    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Event_songs', 'fa-bell', 'event-songs', 400);
    }]);