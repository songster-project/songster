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
        controller: ['$scope', '$http', '$player', '$timeout', '$event', 'EVENT_SONG_CONFIG', '$rootScope', function SoPlayerController($scope, $http, $player, $timeout, $event, EVENT_SONG_CONFIG, $rootScope) {
            var vm = this;

            $scope.player = $player;
            $scope.queue = $player.getQueue();

            $timeout(function () {
                var lastsongid;
                $scope.$on('BROADCAST_STARTED', function () {
                    lastsongid = undefined;
                });
                //add listener to player 'playing' event
                $scope.mediaPlayer.on('playing', function () {
                    var currevent = $event.getBroadcastEvent();
                    // check if broadcast event is running
                    if (currevent !== undefined) {
                        var currtrackidx = $scope.mediaPlayer.currentTrack;
                        var currentSong = $scope.queue[currtrackidx - 1];
                        //see if song has changed
                        if (!lastsongid || lastsongid != currentSong.id) {
                            //create message for server
                            var msg = {
                                message: {nextSongs: [], currentSong: currentSong},
                                type: 'songplayed'
                            };
                            lastsongid = currentSong.id;
                            //copy next five songs starting from current plus 1
                            msg.message.nextSongs = $scope.queue.slice(currtrackidx, currtrackidx + EVENT_SONG_CONFIG.MAX_NUMBER_OF_NEXT_SONGS);
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

            $scope.showAddDialog = function () {
                $scope.addClicked = true;
            };

            $scope.addPlaylist = function (playlistName) {
                $scope.addClicked = false;
                if (playlistName !== '') {

                    var songIDs = [];
                    $scope.queue.forEach(function (song) {
                        songIDs.push(song._id);
                    });

                    $http.post('/playlist', { name: playlistName, songs: songIDs }).
                        success(function () {
                            $rootScope.updatePlaylists();
                        });
                }
            };

            $scope.cancelAddPlaylist = function () {
                $scope.addClicked = false;
                $scope.playlistName = '';
            };
        }],
        controllerAs: 'vm',
        templateUrl: 'player/so-player.tpl.html'
    };
}