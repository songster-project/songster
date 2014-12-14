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
        controller: ['$scope', '$http', '$player', '$timeout', '$event', function SoPlayerController($scope, $http, $player, $timeout, $event) {
            var vm = this;

            $scope.player = $player;
            $scope.queue = $player.getQueue();

            $timeout(function () {
                $scope.mediaPlayer.on('loadstart', function () {
                    var currevent = $event.getBroadcastEvent();
                    if (currevent !== undefined) {
                        var currtrackidx=(($scope.mediaPlayer.currentTrack==0)?0:$scope.mediaPlayer.currentTrack - 1);
                        var msg = {
                            message: {nextSongs: [], currentSong: $scope.player.getQueue()[currtrackidx]},
                            type: 'songplayed'
                        };
                        for (var i = 1; i <= 3 && i<$scope.player.getQueue().length; i++) {
                            var idx = currtrackidx + i;
                            if ((idx) >= 0 && (idx) < $scope.player.getQueue().length) {
                                msg.message.nextSongs.push($scope.player.getQueue()[idx]);
                            }
                        }
                        $http.post('/eventlog/' + currevent._id, msg);
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

            $scope.dragStart = function(e, ui) {
                ui.item.data('start', ui.item.index());
            };

            $scope.dragEnd = function(e, ui) {
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