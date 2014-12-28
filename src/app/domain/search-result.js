'use strict';

angular.module('songster.domain.searchResult')
    .factory('SearchResultFactory', function (SearchAggregationFactory) {
        window.SearchResult = function SearchResult(data) {
            this.total = data ? data.total : undefined;
            this.results = data ? data.results : [];
            this.aggregations = data ? data.aggregations : {};
        };

        window.SearchResult.prototype.fillWithResponse = function fillWithResponse(res, factory) {
            var self = this;
            this.total = res.hits.total;
            this.results = _.map(res.hits.hits, function (hit) {
                return factory.create(hit._source);
            });
            this.aggregations = {};
            _.forEach(_.keys(res.aggregations), function (agg) {
                self.aggregations[agg] = _.map(res.aggregations[agg].buckets, function (bucket) {
                    return SearchAggregationFactory.create({
                        key: bucket.key,
                        count: bucket.doc_count
                    });
                });
            });
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