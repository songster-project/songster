describe('SearchRequest', function () {
    var SearchRequestFactory;

    beforeEach(function () {
        module('songster.domain');

        // Kickstart the injectors previously registered with calls to angular.mock.module
        inject(function (CONFIG) {
            CONFIG.resultsPerPage = 2;
        });
    });

    beforeEach(inject(function (_SearchRequestFactory_) {
        SearchRequestFactory = _SearchRequestFactory_;
        expect(SearchRequestFactory).toBeDefined();
    }));

    describe('factory instance', function () {
        it('should have from property set to 0 by default', function () {
            var searchRequest = SearchRequestFactory.create();
            expect(searchRequest.from).toBe(0);
        });
    });

    describe('factory instance by create', function () {
        it('should have been created', function () {
            var searchRequest = SearchRequestFactory.create();
            expect(searchRequest).toBeDefined();
        });

        it('should have size to be the config size (2) by default', function () {
            var searchRequest = SearchRequestFactory.create();
            expect(searchRequest.size).toBe(2);
        });
    });

    describe('factory instance by createGetAll', function () {
        it('should have been created', function () {
            var searchRequest = SearchRequestFactory.createGetAll();
            expect(searchRequest).toBeDefined();
        });

        it('should have no size limit', function () {
            var searchRequest = SearchRequestFactory.createGetAll();
            console.log(searchRequest.size);
            expect(searchRequest.size).toBeUndefined();
        });
    });

    describe('generateRequest()', function () {
        it('should throw an exception if url is not defined', function () {
            var searchRequest = SearchRequestFactory.create();
            expect(searchRequest.url).toBeUndefined();
            expect(function () {
                searchRequest.generateRequest();
            }).toThrow();
        });

        it('should generate a request if url is defined', function () {
            var searchRequest = SearchRequestFactory.create({url: 'myurl'});
            expect(searchRequest.url).toBeDefined();
            var request = searchRequest.generateRequest();
            expect(request).toContain('myurl');
        });

        it('should contain from', function () {
            var searchRequest = SearchRequestFactory.create({url: 'myurl'});
            expect(searchRequest.from).toBe(0);
            var request = searchRequest.generateRequest();
            expect(request).toContain('from=0');
        });

        it('should contain size', function () {
            var searchRequest = SearchRequestFactory.create({url: 'myurl'});
            expect(searchRequest.size).toBe(2);
            var request = searchRequest.generateRequest();
            expect(request).toContain('size=2');
        });
    });

    describe('setPage(.)', function () {
        it('should throw an exception if page is -1', function () {
            var searchRequest = SearchRequestFactory.create();
            expect(function () {
                searchRequest.setPage(-1);
            }).toThrow();
        });

        it('should throw an exception if page is undefined', function () {
            var searchRequest = SearchRequestFactory.create();
            expect(function () {
                searchRequest.setPage(undefined);
            }).toThrow();
        });

        it('should throw an exception if size is undefined', function () {
            var searchRequest = SearchRequestFactory.create();
            searchRequest.size = undefined;
            expect(function () {
                searchRequest.setPage(1);
            }).toThrow();
        });

        it('should set correct from for page', function () {
            var searchRequest = SearchRequestFactory.create();
            expect(searchRequest.url).toBeUndefined();
            searchRequest.setPage(1);
            expect(searchRequest.from).toBe(0);
            searchRequest.setPage(42);
            expect(searchRequest.from).toBe(82);
        });

        it('should set correct from for page if size is changed', function () {
            var searchRequest = SearchRequestFactory.create();
            searchRequest.size = 5;
            expect(searchRequest.url).toBeUndefined();
            searchRequest.setPage(3);
            expect(searchRequest.from).toBe(10);
        });
    });

});