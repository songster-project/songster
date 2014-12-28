'use strict';

angular.module('songster.domain.searchResult')
    .factory('SearchResultFactory', function (SearchAggregationFactory) {
        window.SearchResult = function SearchResult(data) {
            this.total = data ? data.total : undefined;
            this.results = data ? data.results : [];
            this.aggregations = data ? data.aggregations : [];
        };

        window.SearchResult.prototype.fillWithResponse = function fillWithResponse(res, factory) {
            this.total = res.hits.total;
            this.results = _.map(res.hits.hits, function (hit) {
                return factory.create(hit._source);
            });
            if (res.aggregations) {
                this.aggregations = _.map(res.aggregations.group_by_state.buckets, function (agg) {
                    return SearchAggregationFactory.create({
                        key: agg.key,
                        count: agg.doc_count
                    });
                });
            } else {
                this.aggregations = [];
            }
        };

        window.SearchResult.prototype.update = function update(searchResult) {
            this.total = searchResult.total;
            this.results = searchResult.results;
            this.aggregations = searchResult.aggregations;
        };

        return {
            create: function(data) {
                return new window.SearchResult(data);
            }
        };
    });