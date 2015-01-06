describe('soEventSongs', function () {
    var $scope, func, $websocket, $event, votingService;

    beforeEach(module('songster.event-songs'));

    describe('preview enabled', function () {
        beforeEach(inject(function ($controller, $rootScope, $injector) {
            $websocket = {
                register_to_event: function (str, f, eid) {
                    func = f;
                }
            };
            votingService = {
                setVotesongsOfQueue: function (data) {
                }
            };
            $event = {
                getEvent: function (data) {
                    return {previewEnabled: true};
                }
            };
            var notify = {
                notifyActivityStream: function () {

                }
            };
            var $httpBackend = $injector.get('$httpBackend');
            $httpBackend.whenGET('/event/current').respond(200, '');
            $rootScope.notifyActivityStream = notify;
            spyOn(votingService, 'setVotesongsOfQueue');
            spyOn($rootScope, 'notifyActivityStream');
            $scope = $rootScope.$new();
            $controller('EventCtrl', {
                $scope: $scope,
                $websocket: $websocket,
                $event: $event,
                votingService: votingService
            });
        }));

        it('should update songs with preview enabled', function () {
            var msg = {
                currentSong: {_id: '12345'},
                nextSongs: ['1', '2'],
                lastSongs: ['1', '2']
            };
            func(msg);
            expect($scope.currentSong).toBe(msg.currentSong);
            expect($scope.nextSongs).toBe(msg.nextSongs);
            expect($scope.lastSongs).toBe(msg.lastSongs);
        });

        it('should not update songs if empty message', function () {
            var msg = {
                currentSong: {_id: '12345'},
                nextSongs: ['1', '2'],
                lastSongs: ['1', '2']
            };
            func(msg);
            func({});
            expect($scope.currentSong).toBe(msg.currentSong);
            expect($scope.nextSongs).toBeUndefined();
            expect($scope.lastSongs).toBe(msg.lastSongs);
        });
    });

    describe('preview disabled', function () {
        beforeEach(inject(function ($controller, $rootScope, $injector) {
            $websocket = {
                register_to_event: function (str, f, eid) {
                    func = f;
                }
            };
            votingService = {
                setVotesongsOfQueue: function (data) {
                }
            };
            $event = {
                getEvent: function (data) {
                    return {previewEnabled: false};
                }
            };
            var notify = {
                notifyActivityStream: function () {

                }
            };
            var $httpBackend = $injector.get('$httpBackend');
            $httpBackend.whenGET('/event/current').respond(200, '');
            $rootScope.notifyActivityStream = notify;
            spyOn(votingService, 'setVotesongsOfQueue');
            spyOn($rootScope, 'notifyActivityStream');
            $scope = $rootScope.$new();
            $controller('EventCtrl', {
                $scope: $scope,
                $websocket: $websocket,
                $event: $event,
                votingService: votingService
            });
        }));

        it('should update songs with preview disabled', function () {
            var msg = {
                currentSong: {_id: '12345'},
                nextSongs: ['1', '2'],
                lastSongs: ['1', '2']
            };
            func(msg);
            expect($scope.currentSong).toBe(msg.currentSong);
            expect($scope.nextSongs).toBeUndefined();
            expect($scope.lastSongs).toBe(msg.lastSongs);
        });

        it('should not update songs if empty message', function () {
            var msg = {
                currentSong: {_id: '12345'},
                nextSongs: ['1', '2'],
                lastSongs: ['1', '2']
            };
            func(msg);
            func({});
            expect($scope.currentSong).toBe(msg.currentSong);
            expect($scope.nextSongs).toBeUndefined();
            expect($scope.lastSongs).toBe(msg.lastSongs);
        });

        it('should cut last Songs if there are too many', function () {
            var msg = {
                currentSong: {_id: '12345'},
                nextSongs: ['1', '2', '3', '4', '5', '6', '7'],
                lastSongs: ['1', '2', '3', '4', '5', '6', '7']
            };
            func(msg);
            expect($scope.currentSong).toBe(msg.currentSong);
            expect($scope.nextSongs).toBeUndefined();
            expect($scope.lastSongs).toEqual(['1', '2', '3', '4', '5']);
        });

        it('should add currentSong to lastSongs if new', function () {
            var msg = {
                currentSong: {_id: '1'},
                nextSongs: ['1', '2', '3', '4', '5', '6', '7'],
                lastSongs: ['1', '2', '3', '4', '5', '6', '7']
            };
            var msg2 = {
                currentSong: {_id: '2'}
            };
            func(msg);
            func(msg2);
            expect($scope.currentSong).toBe(msg2.currentSong);
            expect($scope.nextSongs).toBeUndefined();
            expect($scope.lastSongs).toEqual([{_id: '1'},'1', '2', '3', '4']);
        });
    });
});