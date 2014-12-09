angular.module('songster.event-songs')

    .config(function config($stateProvider) {
        $stateProvider.state('event-songs', {
            url: '/event-songs',
            views: {
                "main": {
                    controller: 'event-songsCtrl',
                    templateUrl: 'event-songs/event-songs.tpl.html'
                }
            },
            data: {pageTitle: 'Event Songs'}
        });
    })

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