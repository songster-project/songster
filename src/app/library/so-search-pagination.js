angular
    .module('songster.library')
    .directive('soSearchPagination', function () {
        return {
            restrict: 'AE',
            scope: {
                searchRequest: "=",
                searchResult: "="
            },
            controller: function($scope, CONFIG) {
                $scope.searchResult.currentPage = 1;
                $scope.pages = [];
                $scope.$watch('searchResult.total', function(total) {
                    $scope.lastPage = total / CONFIG.resultsPerPage;
                    var pages = [];
                    for(var i=1; i<=$scope.lastPage; i++) {
                        pages.push({
                            nr: i
                        });
                    }
                    $scope.pages = pages;
                });
                $scope.goToPage = function(page) {
                    if(page < 1 || page > $scope.lastPage) {
                        return;
                    }
                    $scope.searchResult.currentPage = page;
                    $scope.searchRequest.setPage(page);
                    $scope.$parent.search($scope.searchRequest);
                }
            },
            templateUrl: 'library/so-search-pagination.tpl.html'
        }
    });
