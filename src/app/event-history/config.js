angular
    .module('songster.eventHistory')

    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Past Events', 'fa-archive', 'eventHistory', 100);
    }])

    .config(function config($stateProvider) {
        $stateProvider.state('eventHistory', {
            url: '/eventhistory',
            views: {
                "main": {
                    controller: 'EventHistoryController',
                    templateUrl: 'event-history/eventhistory.tpl.html'
                }
            },
            data: {pageTitle: 'Event History'}
        });
    });