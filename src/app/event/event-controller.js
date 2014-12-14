angular.module('songster.event')

    .controller('EventCtrl', function EventCtrl($scope, $location, $http, $event) {
        $scope.event = $event.getEvent();
        $scope.editEvent = {};

        if (!!$scope.event) {
            $scope.eventActive = true;
        } else {
            $scope.eventActive = false;
            //Set standard values
            setStandardValuesForEvent();
        }

        $scope.startEvent = function () {
            $event.startBroadcast($scope.editEvent).then(
                function (event) {
                    $scope.eventActive = true;
                }, function (err) {
                    $scope.eventErrors = err;
                });
        };

        $scope.endEvent = function () {
            $event.stopBroadcast().then(function () {
                    $scope.eventActive = false;
                    $scope.editEvent = {};
                    setStandardValuesForEvent();
                },
                function (err) {
                    $scope.eventErrors = err;
                });
        };

        $scope.generatePublicLink = function (event) {
            var url = $location.host() + ':' + $location.port();
            var eventId = event._id;
            return 'http://' + url + '/voting/' + eventId;
        };

        function setStandardValuesForEvent() {
            $scope.editEvent.votingEnabled = true;
            $scope.editEvent.suggestionEnabled = true;
            $scope.editEvent.previewEnabled = false;
        }

    });


