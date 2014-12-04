angular
    .module('songster.player')
    .directive('soPlayer', [SoPlayerDirective])
    .run(SoPlayerRun);

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

function SoPlayerRun(editableOptions, editableThemes) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

    // use font awesome and not bs3 glyphicons
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary"><i class="fa fa-check"></i></span></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" class="btn btn-default" ng-click="$form.$cancel()">' +
        '<i class="fa fa-times"></i>' +
        '</button>'
}