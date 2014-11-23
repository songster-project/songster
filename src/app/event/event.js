angular.module('songster.event')


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
    })


    .controller('EventCtrl', function HomeController($scope) {
    })

;
