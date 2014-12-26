angular.module('songster.event')

    .controller('EventDetailController', function EventCtrl($scope,$http, $location, $event, $state) {
        $scope.event = $event.getEvent();

        $scope.endEvent = function () {
            $event.stopBroadcast().then(function () {
                $state.go('event');
            });
        };

        $scope.generatePublicLink = function (event) {
            var url = $location.host() + ':' + $location.port();
            var eventId = event._id;
            return 'http://' + url + '/voting/' + eventId;
        };

        $scope.deleteEvent = function (event) {
            $event.deleteEvent(event).then(function () {
                $state.go('event');
            });

        };

        $scope.generateShortLink = function (event) {
            var link = $scope.generatePublicLink(event);
            //Note: Bit.Ly does not support generation of Links for localhost only
            //Therefor (for our local-development) i remove localhost with 127.0.0.1
            console.log($location.host());
            if($location.host() === 'localhost')
            {
                link = link.replace('localhost','127.0.0.1');
            }
           return link;
        };

        $http.get('/event/shorten?q='+$scope.generateShortLink($scope.event))
            .success(function (data) {
                $scope.shortLink = data.url;
                var url = $location.host() + ':' + $location.port();
                $scope.qrLink = "http://"+url+"/event/qr?q="+data.url;
                console.log($scope.qrLink);
            });
    });


