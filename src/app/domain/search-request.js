'use strict';

angular.module('songster.domain.searchRequest')
    .factory('SearchRequestFactory', function(CONFIG) {
        window.SearchRequest = function SearchRequest(data) {
            this.url = data ? data.url : undefined;
            this.q = data ? data.q : undefined;
            this.from = data && data.from ? data.from : 0;
            this.size = data ? data.size : undefined;
        };

        window.SearchRequest.prototype.generateRequest = function generateRequest() {
            if (this.url === undefined) {
                throw 'url must be defined';
            }

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
            if (page === undefined) {
                throw 'page must be defined';
            }
            if (page < 1) {
                throw 'page must greater or equal to 1';
            }
            if (this.size === undefined) {
                throw 'size must be defined';
            }
            this.from = this.size * (page - 1);
        };

        return {
            create: function(data) {
                var dataObj = data || {};
                dataObj.size = dataObj.size || CONFIG.resultsPerPage;
                return new window.SearchRequest(dataObj);
            },
            createGetAll: function(data) {
                var dataObj = data || {};
                dataObj.size = undefined;
                return new window.SearchRequest(dataObj);
            }
        };
    });