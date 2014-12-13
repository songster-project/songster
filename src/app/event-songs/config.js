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
    }])

    .run(function config($rootScope, eventService) {
        // TODO this needs to be removed
        $rootScope.$on('BROADCAST_STARTED', function (event /*event of the listener*/, broadcastEvent) {
            eventService.setEventActive(true);
            eventService.setEventData(broadcastEvent);
        });
        $rootScope.$on('BROADCAST_STOPPED', function () {
            eventService.setEventActive(false);
            eventService.setEventData({});
        });
    });