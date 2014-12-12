'use strict';

angular.module('songster.domain.searchResult')
    .config(function() {
        window.SearchResult = function SearchResult(data) {
            this.total = data ? data.total : undefined;
            this.results = data ? data.results : [];
        };

        window.SearchResult.prototype.fillWithResponse = function fillWithResponse(res, domainClass) {
            this.total = res.hits.total;
            this.results = _.map(res.hits.hits, function (hit) {
                return new domainClass(hit._source);
            });
        }
    });