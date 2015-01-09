angular
    .module('songster.eventTv')

    .config(function config($stateProvider) {
        $stateProvider.state('eventTv', {
            url: '/event/:id/tv',
            views: {
                "main": {
                    controller: 'EventTvController',
                    templateUrl: 'event-tv/event-tv.tpl.html'
                }
            },
            resolve: {
                event: function ($event, $stateParams) {
                    return $event.loadEvent($stateParams.id);
                }
            },
            onEnter: function ($rootScope) {
                $rootScope.isMenuVisible = false;
                $rootScope.isPlayerVisible = false;
            },
            onExit: function ($rootScope) {
                $rootScope.isMenuVisible = true;
                $rootScope.isPlayerVisible = true;
            }
        });
    });