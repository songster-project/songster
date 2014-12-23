'use strict';

angular.module('songster.domain.searchRequest')
    .factory('SearchRequestFactory', function(CONFIG) {
        window.SearchRequest = function SearchRequest(data) {
            this.url = data ? data.url : undefined;
            this.q = data ? data.q : undefined;
            this.from = data ? data.from : 0;
            this.size = data ? data.size : CONFIG.resultsPerPage;
        };

        window.SearchRequest.prototype.generateRequest = function generateRequest() {
            var params = [];
            if(this.q !== undefined) {
                params.push('q=' + this.q);
            }
            if(this.from !== undefined) {
                params.push('from=' + this.from);
            }
            if(this.size !== undefined) {
                params.push('size=' + this.size);
            }

            var request = this.url;
            if(!_.isEmpty(params)) {
                request += '?';
                request += params.join('&');
            }
            return request;
        };

        window.SearchRequest.prototype.setPage = function setPage(page) {
            this.from = CONFIG.resultsPerPage * (page - 1);
        };

        return {
            create: function(data) {
                return new window.SearchRequest(data);
            }
        };
    });