angular
    .module('songster.event-songs')
    .directive('soEventSongs', SoEventSongsDirective);

function SoEventSongsDirective() {
    return {
        restrict: 'AE',
        scope: {
            eventId: "="
        },
        controller: function EventCtrl($scope, $websocket, $event, $rootScope, votingService) {
            $scope.previewEnabled=$event.getEvent().previewEnabled;
            var data = {
                eventid: $scope.eventId
            };
            $websocket.register_to_event('music_changed', function (msg) {
                $scope.lastSongs = msg.lastSongs;
                $scope.currentSong = msg.currentSong;
                $scope.nextSongs = msg.nextSongs;
                $scope.$apply();

                $rootScope.notifyActivityStream(msg);
            }, data);
        },
        templateUrl: 'event-songs/so-event-songs.tpl.html'
    };
}
