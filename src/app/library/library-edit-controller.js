angular.module('songster.library')

    .controller('LibraryEditController', function EventCtrl($scope, $http, $library, $player, $window) {

        // generic function to remove elements from an ng-repeat array
        $scope.remove = function (array, index) {
            array.splice(index, 1);
        };

        $scope.updateSongMetadata = function (song) {
            return $library.updateSongMetadata(song)
        };

        $scope.updateCover = function (song) {
            $library.updateCover(song).success(function (data, status, headers, config) {
                song.cover = data.cover;
            });
        };
    });


