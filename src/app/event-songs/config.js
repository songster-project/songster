angular
    .module('songster.event-songs')

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