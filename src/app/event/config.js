angular
    .module('songster.event')

    .config(function config($stateProvider) {
        $stateProvider.state('event', {
            url: '/event',
            views: {
                "main": {
                    controller: 'EventCtrl',
                    templateUrl: 'event/event.tpl.html'
                }
            },
            data: {pageTitle: 'Mange your events!'}
        });

        $stateProvider.state('voting', {
            url: '/voting/:eventId/:anonymous',
            views: {
                "main": {
                    controller: 'EventCtrl',
                    templateUrl: 'event/event.tpl.html'
                }
            }
        });
    })

    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Event', 'fa-bullhorn', 'event', 499);
    }]);