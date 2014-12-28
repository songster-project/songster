'use strict';

angular.module('songster.domain.searchAggregation')
    .factory('SearchAggregationFactory', function () {
        window.SearchAggregation = function SearchAggregation(data) {
            this.key = data ? data.key : undefined;
            this.count = data ? data.count : undefined;
        };

        return {
            create: function (data) {
                return new window.SearchAggregation(data);
            }
        };
    });