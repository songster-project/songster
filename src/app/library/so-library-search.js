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
        controller: ['$scope', '$http', '$library', function SoLibrarySearchDirective($scope, $http, $library) {
            $scope.total = 0;
            $scope.searchRequest = {};
            $scope.songs = [];

            if (!!$scope.customView) {
                $scope.resultView = $scope.customView;
            } else {
                $scope.resultView = 'library/so-library-search-result.tpl.html';
            }

            function search(query) {
                $library.search(query, $scope.eventId).then(function (searchResult) {
                    $scope.total = searchResult.total;
                    $scope.songs = searchResult.results;
                });
            }

            $scope.search = function (searchRequest) {
                search(searchRequest.query);
            };

            $scope.hasActions = function() {
                return !_.isEmpty($scope.actions);
            };

            search();
        }],
        templateUrl: 'library/so-library-search.tpl.html'
    };
}

