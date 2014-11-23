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


    .controller('EventCtrl', function EventCtrl($scope,  $http) {

        //First we check if we have an event ...
        $http.get('/event/current')
            .success(function (data) {
                $scope.event = data;
                if(data.isEmptyObject()) {
                    $scope.eventActive = false;
                }
                else {
                    $scope.eventActive = true;
                }
            });

        $scope.startEvent = function() {

            $scope.eventActive = true;
        };

    })

;
