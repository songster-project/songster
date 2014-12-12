angular.module('songster.event')

    .controller('EventCtrl',function EventCtrl($scope, $location, $http,eventService, $stateParams, $auth) {

        //ToDo: Manuel => as discussed in the last week of september, you said you are going to continue at this point
        //by going to manage that the availability of the menu ...
        $auth.setAnonymous(!!$stateParams.anonymous);

        $scope.eventId = $stateParams.eventId;

        if(!!$scope.eventId) {
            $http.get('/event/' + $scope.eventId)
                .success(function (data) {
                    $scope.event = data;
                    $scope.eventActive = true;
                });
        } else {
            $scope.location=$location;
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


