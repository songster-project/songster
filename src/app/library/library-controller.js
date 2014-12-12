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

        // generic function to remove elements from an ng-repeat array
        $scope.remove = function (array, index) {
            array.splice(index, 1);
        };

        $scope.updateSongMetadata = function(song) {
            return $library.updateSongMetadata(song)
        };

        $scope.updateCover = function(song) {
            $library.updateCover(song).success(function(data, status, headers, config) {
                song.cover = data.cover;
            });
        };
    });


