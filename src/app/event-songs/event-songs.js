angular.module('songster.event-songs')

    .controller('event-songsCtrl', function EventCtrl($scope, nClient) {
        $scope.register_to_event = function () {
            var data = {
                eventid: $scope.eventid
            };
            nClient.register_to_event('music_changed', function (msg) {
                $scope.lastSongs = msg.lastSongs;
                $scope.currentSong = msg.currentSong;
                $scope.nextSongs = msg.nextSongs;
                $scope.$apply();
            }, data);
        };
    });