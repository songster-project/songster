angular
    .module('songster.library')
    .directive('soSearchPagination', function () {
        return {
            restrict: 'AE',
            scope: {
                searchRequest: "=",
                searchResult: "="
            },
            controller: function($scope, CONFIG, paginationConfig) {
                // configuration
                paginationConfig.itemsPerPage = CONFIG.resultsPerPage;
                paginationConfig.rotate = false;
                $scope.maxSize = CONFIG.pagination.maxShownPages;

                $scope.searchResult.currentPage = 1;
                $scope.pageChanged = function() {
                    $scope.searchRequest.setPage($scope.searchResult.currentPage);
                    $scope.$parent.search($scope.searchRequest);
                };
            },
            templateUrl: 'library/so-search-pagination.tpl.html'
        }
    });
