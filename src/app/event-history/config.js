angular
    .module('songster.eventHistory')
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