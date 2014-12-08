angular
    .module('songster.library')
    .directive('soLibrarySearch', SoLibrarySearchDirective);

function SoLibrarySearchDirective() {
    return {
        restrict: 'AE',
        scope: {
            actions: "="
            /*
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
        },
        replace: true,
        controller: ['$scope', '$http', '$library', function SoLibrarySearchDirective($scope, $http, $library) {
            $scope.total = 0;
            $scope.searchRequest = {};
            $scope.songs = [];

            function search(query) {
                $library.search(query).success(function (res) {
                    $scope.total = res.hits.total;
                    $scope.songs = _.map(res.hits.hits, function (hit) {
                        return new window.Song(hit._source);
                    });
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

