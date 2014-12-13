angular.module('songster.event')

    .controller('EventCtrl', function EventCtrl($scope, $location, $http, eventService, $event) {
        $scope.event = $event.getEvent();
        $scope.location = $location;

        if (!!$scope.event) {
            $scope.eventActive = true;
        } else {
            // $scope.eventActive = false;
            //First we check if we have an event ...
            $event.getCurrentEvent()
                .then(function (event) {
                    $scope.event = event;
                    if (_.isEmpty(event)) {
                        $scope.eventActive = false;
                        //Set standard values
                        $scope.setStandardValuesForEvent();
                    }
                    else {
                        $scope.eventActive = true;
                    }
                });

            $scope.startEvent = function () {
                $http.get('/account/id').success(function (data) {
                    $scope.event.owner_id = data.id;
                    $http.post('/event', $scope.event).
                        success(function (data, status, headers, config) {
                            eventService.setEventActive(true);
                            eventService.setEventData(data);
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
                        eventService.setEventActive(false);
                        eventService.setEventData({});
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
        }

    });


