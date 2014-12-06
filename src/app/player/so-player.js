angular
    .module('songster.player')
    .directive('soPlayer', [SoPlayerDirective])

function SoPlayerDirective() {
    return {
        restrict: 'AE',
        scope: {
            menuId: "="
        },
        replace: true,
        controller: ['$scope', '$http', '$player', function SoPlayerController($scope, $http, $player) {
            var vm = this;

            $scope.player = $player;
            $scope.queue = $player.getQueue();

            $http.get('/song/')
                .success(function (data) {
                    $scope.songs = data;
                    data.forEach(function (song) {
                        $player.add(song);
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