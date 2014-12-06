angular.module('songster.library')

    .controller('LibraryController', function EventCtrl($scope, $http, $library, $player) {

        $scope.total = 0;
        $scope.searchRequest = {};
        $scope.songs = [];

        // generic function to remove elements from an ng-repeat array
        $scope.remove = function (array, index) {
            array.splice(index, 1);
        };

        function search(query) {
            $library.search(query).success(function(res) {
                $scope.total = res.hits.total;
                $scope.songs = _.map(res.hits.hits, function (hit) {
                    return new window.Song(hit._source);
                });
            });
        }

        $scope.updateSongMetadata = function(song) {
            return $library.updateSongMetadata(song)
        };

        $scope.updateCover = function(song) {
            $library.updateCover(song).success(function(data, status, headers, config) {
                song.cover = data.cover;
            });
        };

        $scope.addToPlayer = function(song) {
            $player.addFirst(song);
        };

        $scope.search = function (searchRequest) {
            search(searchRequest.query);
        };

        search();
    });


