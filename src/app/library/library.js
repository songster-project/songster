angular.module('songster.library')

    .controller('LibraryController', function EventCtrl($scope, $http) {

        $scope.searchRequest = {};
        $scope.results = [];

        // TODO create a library service and put it into there
        function search(query) {
            var url = '/search/song';
            if (!!query) {
                url += '/' + query;
            }
            $http.get(url)
                .success(function (res) {
                    $scope.total = res.hits.total;
                    $scope.results = _.map(res.hits.hits, function (hit) {
                        return hit._source;
                    });
                });
        }

        $scope.search = function (searchRequest) {
            search(searchRequest.query);
        };

        search();
    });


