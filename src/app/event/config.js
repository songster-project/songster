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
            resolve: {
                event: function ($event) {
                    return $event.loadCurrentEvent();
                }
            }
        });

        $stateProvider.state('voting', {
            url: '/voting/:eventId',
            views: {
                "main": {
                    controller: 'EventCtrl',
                    templateUrl: 'event/event.tpl.html'
                }
            },
            resolve: {
                event: function ($event, $stateParams) {
                    return $event.loadEvent($stateParams.eventId);
                }
            }
        });
    })

    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Event', 'fa-bullhorn', 'event', 499);
    }]);