angular
    .module('songster.event')

    .config(function config($stateProvider) {
        $stateProvider.state('event', {
            url: '/event',
            views: {
                "main": {
                    controller: 'EventListController',
                    templateUrl: 'event/event-list.tpl.html'
                }
            }
        });

        $stateProvider.state('eventNew', {
            url: '/event/new',
            views: {
                "main": {
                    controller: 'EventNewController',
                    templateUrl: 'event/event-new.tpl.html'
                }
            }
        });

        $stateProvider.state('eventDetail', {
            url: '/event/:id',
            views: {
                "main": {
                    controller: 'EventDetailController',
                    templateUrl: 'event/event-detail.tpl.html'
                }
            },
            resolve: {
                event: function ($event, $stateParams) {
                    return $event.loadEvent($stateParams.id);
                }
            }
        });


        $stateProvider.state('broadcast', {
            template: '<ui-view>',
            controller: function () {
            },
            onEnter: function ($state, $event) {
                var broadcastEvent = $event.getBroadcastEvent();
                $state.transitionTo('eventDetail', {
                    id: broadcastEvent._id
                })
            }
        });
    })

    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Events', 'fa-bullhorn', 'event', 300);
    }])

    .run(['$event', function ($event) {
        $event.loadBroadcastEvent();
    }]);