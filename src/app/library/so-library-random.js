angular
    .module('songster.library')
    .directive('soLibraryRandom', function () {
        return {
            restrict: 'AE',
            scope: true,
            controller: function ($scope, $library, SongFactory, SearchRequestFactory, SearchResultFactory) {
                $scope.searchResult = SearchResultFactory.create();
                var searchRequest = SearchRequestFactory.create();

                var url = '/search';
                if ($scope.eventId !== undefined) {
                    url += '/event/' + $scope.eventId;
                }
                url += '/random';
                searchRequest.url = url;

                $scope.random = function () {
                    $library.search(searchRequest, SongFactory).then(function (searchResult) {
                        $scope.searchResult.update(searchResult);
                    });
                };

                $scope.random();
            },
            templateUrl: 'library/so-library-random.tpl.html'
        };
    });
