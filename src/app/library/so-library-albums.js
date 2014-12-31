angular
    .module('songster.library')
    .directive('soLibraryAlbums', function () {
        return {
            restrict: 'AE',
            transclude: true,
            controller: function ($scope, $library, SongFactory, SearchRequestFactory, SearchResultFactory) {
                $scope.albumsResult = SearchResultFactory.create();
                var searchRequest = SearchRequestFactory.create();

                var url = '/search';
                if ($scope.eventId !== undefined) {
                    url += '/event/' + $scope.eventId;
                }
                url += '/album';
                searchRequest.url = url;

                $library.search(searchRequest).then(function (searchResult) {
                    $scope.albumsResult.update(searchResult);
                });

                $scope.searchAlbum = function (albumName) {
                    $scope.searchRequest.q = albumName;
                    $scope.search($scope.searchRequest);
                    $scope.jumpToResultTab();
                }
            },
            templateUrl: 'library/so-library-albums.tpl.html'
        };
    });
