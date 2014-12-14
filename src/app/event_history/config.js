angular
    .module('songster.eventhistory')

    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Past Events', 'fa-archive', 'eventhistory', 100);
    }])

    .config(function config($stateProvider) {
        $stateProvider.state('eventhistory', {
            url: '/eventhistory',
            views: {
                "main": {
                    controller: 'EventHistoryController',
                    templateUrl: 'event_history/eventhistory.tpl.html'
                }
            },
            data: {pageTitle: 'Event History'}
        });
    });