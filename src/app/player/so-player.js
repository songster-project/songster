angular
    .module('songster.player')
    .directive('soPlayer', SoPlayerDirective);

function SoPlayerDirective() {
    return {
        restrict: 'AE',
        scope: {
            menuId: "="
        },
        replace: true,
        controller: ['$scope', '$http', '$player', '$timeout', '$event','EVENT_SONG_CONFIG', function SoPlayerController($scope, $http, $player, $timeout, $event,EVENT_SONG_CONFIG) {
            var vm = this;

            $scope.player = $player;
            $scope.queue = $player.getQueue();

            $timeout(function () {
                var lastsongid;
                //add listener to player events
                $scope.mediaPlayer.on('playing', function () {
                    var currevent = $event.getBroadcastEvent();
                    // check if broadcast event is running
                    if (currevent !== undefined) {
                        //if currentTrack in mediaplayer is 0 we don't need to reduce it (happens at first event)
                        var currtrackidx = (($scope.mediaPlayer.currentTrack == 0) ? 0 : $scope.mediaPlayer.currentTrack - 1);
                        var currentSong = $scope.queue[currtrackidx];
                        //compare current and last song to see if song has changed
                        if (lastsongid != currentSong.id) {
                            //create message for server
                            var msg = {
                                message: {nextSongs: [], currentSong: currentSong},
                                type: 'songplayed'
                            };
                            lastsongid=currentSong.id;
                            var queuelength=$scope.queue.length;
                            //run for loop until we have enough songs or until there are no more songs in the queue
                            for (var i = 1; i <= EVENT_SONG_CONFIG.MAX_NUMBER_OF_NEXT_SONGS && currtrackidx + i < queuelength; i++) {
                                var idx = currtrackidx + i;
                                msg.message.nextSongs.push($scope.queue[idx]);
                            }
                            //send massege for current event to server;
                            $http.post('/eventlog/' + currevent._id, msg);
                        }
                    }
                });
            });

            $scope.seekPercentage = function ($event) {
                var percentage = ($event.offsetX / $event.target.offsetWidth);
                if (percentage <= 1) {
                    return percentage;
                } else {
                    return 0;
                }
            };

            $scope.dragStart = function (e, ui) {
                ui.item.data('start', ui.item.index());
            };

            $scope.dragEnd = function (e, ui) {
                var start = ui.item.data('start'),
                    end = ui.item.index();

                console.log('drag ended');

                $scope.sortableArray.splice(end, 0,
                    $scope.sortableArray.splice(start, 1)[0]);

                $scope.$apply();
            };
        }],
        controllerAs: 'vm',
        templateUrl: 'player/so-player.tpl.html'
    };
}