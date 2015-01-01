angular
    .module('songster.library')
    .directive('soLibrarySearch', SoLibrarySearchDirective);

function SoLibrarySearchDirective() {
    return {
        restrict: 'AE',
        scope: {
            /*
             this is how an action array looks like:
             actions = [
                {
                    'title': 'Title of the action',
                    'icon': 'fa-cool-icon',
                    'fn': function(song) {
                        // your function
                    }
                }
             ];
             */
            actions: "=",

            // optional: you can specify a custom view for the results
            customView: "=",

            eventId: "="
        },
        transclude: true,
        replace: true,
        controller: function SoLibrarySearchDirective($scope, $library, SongFactory, SearchRequestFactory, SearchResultFactory) {
            $scope.searchRequest = SearchRequestFactory.create();
            $scope.searchResult = SearchResultFactory.create();
            $scope.tabs = [
                {active: true},
                {active: false},
                {active: false},
                {active: false},
                {active: false}
            ];

            var lastSearchQuery = undefined;

            var url = '/search';
            if ($scope.eventId !== undefined) {
                url += '/event/' + $scope.eventId;
            }
            url += '/song';
            $scope.searchRequest.url = url;

            if (!!$scope.customView) {
                $scope.resultView = $scope.customView;
            } else {
                $scope.resultView = 'library/so-library-search-result.tpl.html';
            }

            function search(searchRequest) {
                // if the search query is empty, we load all songs
                if(_.isEmpty(searchRequest.q)) {
                    searchRequest.q = undefined;
                }
                if(searchRequest.q !== lastSearchQuery) {
                    $scope.searchRequest.setPage(1);
                }
                $library.search(searchRequest, SongFactory).then(function (searchResult) {
                    if(searchRequest.q !== lastSearchQuery) {
                        $scope.searchResult.currentPage = 1;
                    }
                    lastSearchQuery = searchRequest.q;
                    $scope.searchResult.update(searchResult);
                });
            }

            $scope.search = function (searchRequest) {
                search(searchRequest);
            };

            $scope.hasActions = function() {
                return !_.isEmpty($scope.actions);
            };

            $scope.jumpToResultTab = function () {
                $scope.tabs[0].active = true;
                $scope.tabs[1].active = false;
            };

            // very ugly hack to remove the second tab bar - necessary because we used tabs and not routes
            $scope.removeTabsForSuggestMode = function () {
                if ($scope.suggestMode) {
                    var tabs = $(".nav-tabs");
                    if (tabs.length == 2) {
                        $(tabs[1]).hide();
                    }
                }
            };

            search($scope.searchRequest);
        },
        templateUrl: 'library/so-library-search.tpl.html'
    };
}

