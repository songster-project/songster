angular
    .module('songster.player')
    .directive('soPlayer', [SoPlayerDirective]);

function SoPlayerDirective() {
    return {
        restrict: 'AE',
        scope: {
            menuId: "="
        },
        replace: true,
        controller: ['$scope', '$http', function SoPlayerController($scope, $http) {
            var vm = this;
            vm.songs = [];
            vm.mediaPlaylist = [];
        }],
        controllerAs: 'vm',
        templateUrl: 'player/so-player.tpl.html'
    };
}