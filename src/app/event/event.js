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


    .controller('EventCtrl', function EventCtrl($scope, $http) {

        // $scope.eventActive = false;
        //First we check if we have an event ...
        $http.get('/event/current')
            .success(function (data) {
                $scope.event = data;
                if (_.isEmpty(data)) {
                    $scope.eventActive = false;
                    //Set standard values
                    $scope.setStandardValuesForEvent();
                }
                else {
                    $scope.eventActive = true;
                }
            });

        $scope.startEvent = function () {
            //ToDo: acceessKey ... look if we really need it
            //also ... owner_id is currently hardcoded to user1
            $scope.event.accessKey = '1234';
            $http.get('/account/id').success(function (data) {
                $scope.event.owner_id = data.id;
                $http.post('/event', $scope.event).
                    success(function (data, status, headers, config) {
                        $scope.eventActive = true;
                        $scope.event = data;
                    }).
                    error(function (data, status, headers, config) {
                        $scope.eventErrors = data;
                    });
            });
        };

        $scope.endEvent = function () {
            $http.put('/event/current/end', {}).
                success(function (data, status, headers, config) {
                    $scope.eventActive = false;
                    $scope.event = {};
                    $scope.setStandardValuesForEvent();
                }).
                error(function (data, status, headers, config) {
                    $scope.eventErrors = data;
                });
        };

        $scope.setStandardValuesForEvent = function () {
            $scope.event.votingEnabled = true;
            $scope.event.suggestionEnabled = true;
            $scope.event.previewEnabled = false;
        };


    });


