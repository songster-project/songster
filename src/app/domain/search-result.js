'use strict';

angular.module('songster.domain.searchResult')
    .factory('SearchResultFactory', function() {
        window.SearchResult = function SearchResult(data) {
            this.total = data ? data.total : undefined;
            this.results = data ? data.results : [];
        };

        window.SearchResult.prototype.fillWithResponse = function fillWithResponse(res, factory) {
            this.total = res.hits.total;
            this.results = _.map(res.hits.hits, function (hit) {
                return factory.create(hit._source);
            });
        };

        window.SearchResult.prototype.update = function update(searchResult) {
            this.total = searchResult.total;
            this.results = searchResult.results;
        };

        return {
            create: function(data) {
                return new window.SearchResult(data);
            }
        };
    });