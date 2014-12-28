angular
    .module('songster.library')
    .directive('soLibraryArtists', function () {
        return {
            restrict: 'AE',
            transclude: true,
            controller: function SoLibrarySearchDirective($scope, $library, SongFactory, SearchRequestFactory, SearchResultFactory) {
                $scope.artistsResult = SearchResultFactory.create();
                var searchRequest = SearchRequestFactory.create();

                var url = '/search';
                if ($scope.eventId !== undefined) {
                    url += '/event/' + $scope.eventId;
                }
                url += '/artist';
                searchRequest.url = url;

                $library.search(searchRequest).then(function (searchResult) {
                    $scope.artistsResult.update(searchResult);
                });

                $scope.searchArtist = function (artistName) {
                    $scope.searchRequest.q = artistName;
                    $scope.search($scope.searchRequest);
                    $scope.jumpToResultTab();
                }
            },
            templateUrl: 'library/so-library-artists.tpl.html'
        };
    });
