angular.module('songster.library')

    .controller('LibraryController', function EventCtrl($scope, $http, $library, $player, $window) {

        $scope.actions = [
            {
                'title': 'Add to queue',
                'icon': 'fa-plus',
                'fn': function(song) {
                    $player.add(song);
                }
            }, {
                'title': 'Delete song',
                'icon': 'fa-trash-o',
                'fn': function (song) {
                    $library.deleteSong(song);
                }
            }
        ];

    });


