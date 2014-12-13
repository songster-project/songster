angular
    .module('songster.event-songs')

    .config(function config($stateProvider) {
        $stateProvider.state('event-songs', {
            url: '/event-songs',
            views: {
                "main": {
                    controller: 'event-songsCtrl',
                    templateUrl: 'event-songs/event-songs.tpl.html'
                }
            },
            data: {pageTitle: 'Event Songs'}
        });
    })

    .config(['$menuProvider', function ($menuProvider) {
        //$menuProvider.addMenuEntry('main', 'Event_songs', 'fa-bell', 'event-songs', 400);
    }]);