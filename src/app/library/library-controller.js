angular.module('songster.library')

    .controller('LibraryController', function EventCtrl($scope, $http, $library, $player, $window) {

        $scope.actions = [
            {
                'title': 'Add to queue',
                'icon': 'fa-plus',
                'fn': function(song) {
                    $player.add(song);
                }
            },{
                'title': 'Play raw',
                'icon': 'fa-play',
                'fn': function(song) {
                    $window.location.href = song.getRawSrc()
                }
            }
        ];

    });


