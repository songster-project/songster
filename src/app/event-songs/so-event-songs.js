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
            $scope.lastSongs = [];
            $scope.previewEnabled=$event.getEvent().previewEnabled;
            var data = {
                eventid: $scope.eventId
            };
            $websocket.register_to_event('music_changed', function (msg) {
                console.log(msg);
                //if there is a new currentSong add it to the last Songs
                //if there are lastSongs send from the server take them
                if(!msg.lastSongs && msg.currentSong && $scope.currentSong && $scope.currentSong._id !== msg.currentSong._id){
                    $scope.lastSongs.unshift($scope.currentSong);
                }else if(msg.lastSongs){
                    $scope.lastSongs = msg.lastSongs;
                }
                //cut lastSongs if there are too many
                if($scope.lastSongs && $scope.lastSongs.length > 5){
                    $scope.lastSongs.splice(5,$scope.lastSongs.length-5);
                }
                $scope.currentSong = msg.currentSong||$scope.currentSong;
                if($scope.previewEnabled) {
                    $scope.nextSongs = msg.nextSongs || $scope.nextSongs;
                }
                $scope.$apply();

                $rootScope.notifyActivityStream(msg);
            }, data);
        },
        templateUrl: 'event-songs/so-event-songs.tpl.html'
    };
}
