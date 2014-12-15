/*describe('player', function () {
    var $player;
    var $playerProvider;

    beforeEach(function () {
        module('songster.player.services', function (_$playerProvider_) {
            $playerProvider = _$playerProvider_;
        });

        // Kickstart the injectors previously registered with calls to angular.mock.module
        inject(function () {
        });

        expect($playerProvider).toBeDefined();
    });

    beforeEach(inject(function (_$player_) {
        $player = _$player_;
        expect($player).toBeDefined();
    }));

    describe('queue', function () {

        var queueTestData = [
            new window.Song({
                "_id": "547f8c17c832ca870272c914",
                "addedDate": "2014-12-03T22:17:53.494Z",
                "album": "The Black Market",
                "artist": "Rise Against",
                "cover": "547f8c17fadc7287023a15b5",
                "file_id": "547f8c11fadc7287023a1576",
                "owner_id": "547f3e6bc2683a1707365155",
                "title": "The Black Market",
                "year": "2014"
            }),
            new window.Song({
                "addedDate": "2014-12-03T22:17:53.486Z",
                "title": "Tragedy + Time",
                "album": "The Black Market",
                "artist": "Rise Against",
                "year": "2014",
                "owner_id": "547f3e6bc2683a1707365155",
                "cover": "547f8c17fadc7287023a15b6",
                "file_id": "547f8c11fadc7287023a1575",
                "_id": "547f8c17c832ca870272c915"
            }),
            new window.Song({
                "_id": "547f8c1ac832ca870272c916",
                "addedDate": "2014-12-03T22:17:51.903Z",
                "album": "The Black Market",
                "artist": "Rise Against",
                "cover": "547f8c15fadc7287023a15b3",
                "file_id": "547f8c0ffadc7287023a155a",
                "owner_id": "547f3e6bc2683a1707365155",
                "title": "The Great Die-Off",
                "year": "2014"
            })
        ];

        beforeEach(function () {
            expect($player.getQueue()).toBeDefined();
        });

        it('should be empty on init', function () {
            expect($player.getQueue().length).toEqual(0);
        });

        it('should accept valid song metadata on add()', function () {
            $player.add(queueTestData[0]);
            expect($player.getQueue().length).toEqual(1);
        });

        it('should deny invalid song metadata on add()', function () {
            $player.add({ "yolo": true });
            expect($player.getQueue().length).toEqual(0);
        });

        it('should accept valid song metadata on addFirst()', function () {
            $player.addFirst(queueTestData[0]);
            expect($player.getQueue().length).toEqual(1);
        });

        it('should deny invalid song metadata on addFirst()', function () {
            $player.addFirst({ "yolo": true });
            expect($player.getQueue().length).toEqual(0);
        });

        it('should add() new metadata always at the end', function () {
            $player.add(queueTestData[0]);
            $player.add(queueTestData[1]);
            $player.add(queueTestData[2]);
            expect($player.getQueue().length).toEqual(3);
            expect($player.getQueue()[0]).toEqual(queueTestData[0]);
            expect($player.getQueue()[1]).toEqual(queueTestData[1]);
            expect($player.getQueue()[2]).toEqual(queueTestData[2]);
        });

        it('should add metadata in the beginning with addFirst()', function () {
            $player.addFirst(queueTestData[0]);
            $player.addFirst(queueTestData[1]);
            $player.addFirst(queueTestData[2]);
            expect($player.getQueue().length).toEqual(3);
            expect($player.getQueue()[0]).toEqual(queueTestData[2]);
            expect($player.getQueue()[1]).toEqual(queueTestData[1]);
            expect($player.getQueue()[2]).toEqual(queueTestData[0]);
        });

        it('should not allow duplicates', function () {
            $player.add(queueTestData[0]);
            $player.add(queueTestData[0]);
            $player.add(queueTestData[0]);
            expect($player.getQueue().length).toEqual(1);
            expect($player.getQueue()[0]).toEqual(queueTestData[0]);
        });

        it('should delete the queue when using clear()', function () {
            $player.add(queueTestData[0]);
            $player.add(queueTestData[1]);
            $player.add(queueTestData[2]);
            expect($player.getQueue().length).toEqual(3);
            $player.clear();
            expect($player.getQueue().length).toEqual(0);
        });

        describe('with existing songs', function() {

            beforeEach(function () {
                $player.add(queueTestData[0]);
                $player.add(queueTestData[1]);
                $player.add(queueTestData[2]);
                expect($player.getQueue().length).toEqual(3);
                expect($player.getQueue()[0]).toEqual(queueTestData[0]);
                expect($player.getQueue()[1]).toEqual(queueTestData[1]);
                expect($player.getQueue()[2]).toEqual(queueTestData[2]);
            });

            it('should ignore remove() with an invalid index', function () {
                $player.removeSong(4);
                $player.removeSong(-1);
                expect($player.getQueue().length).toEqual(3);
                expect($player.getQueue()[0]).toEqual(queueTestData[0]);
                expect($player.getQueue()[1]).toEqual(queueTestData[1]);
                expect($player.getQueue()[2]).toEqual(queueTestData[2]);
            });

            it('should remove elements from the correct place', function () {
                $player.removeSong(2);
                expect($player.getQueue()[0]).toEqual(queueTestData[0]);
                expect($player.getQueue()[1]).toEqual(queueTestData[1]);
                $player.removeSong(0);
                expect($player.getQueue()[0]).toEqual(queueTestData[1]);
                $player.removeSong(0);
                expect($player.getQueue().length).toEqual(0);
            });

            it('should deny a pushUp of the first element', function () {
                $player.pushSongUp(0);
                expect($player.getQueue().length).toEqual(3);
                expect($player.getQueue()[0]).toEqual(queueTestData[0]);
                expect($player.getQueue()[1]).toEqual(queueTestData[1]);
                expect($player.getQueue()[2]).toEqual(queueTestData[2]);
            });

            it('should deny a pushDown of the last element', function () {
                $player.pushSongDown(2);
                expect($player.getQueue().length).toEqual(3);
                expect($player.getQueue()[0]).toEqual(queueTestData[0]);
                expect($player.getQueue()[1]).toEqual(queueTestData[1]);
                expect($player.getQueue()[2]).toEqual(queueTestData[2]);
            });

            it('should deny a pushUp and pushDown of an out of range index', function () {
                $player.pushSongUp(-1);
                $player.pushSongUp(4);
                $player.pushSongDown(-1);
                $player.pushSongDown(4);
                expect($player.getQueue().length).toEqual(3);
                expect($player.getQueue()[0]).toEqual(queueTestData[0]);
                expect($player.getQueue()[1]).toEqual(queueTestData[1]);
                expect($player.getQueue()[2]).toEqual(queueTestData[2]);
            });

            it('should swap two songs with pushUp()', function () {
                $player.pushSongUp(1);
                expect($player.getQueue().length).toEqual(3);
                expect($player.getQueue()[0]).toEqual(queueTestData[1]);
                expect($player.getQueue()[1]).toEqual(queueTestData[0]);
                expect($player.getQueue()[2]).toEqual(queueTestData[2]);
            });

            it('should swap two songs with pushDown()', function () {
                $player.pushSongDown(0);
                expect($player.getQueue().length).toEqual(3);
                expect($player.getQueue()[0]).toEqual(queueTestData[1]);
                expect($player.getQueue()[1]).toEqual(queueTestData[0]);
                expect($player.getQueue()[2]).toEqual(queueTestData[2]);
            });
        });
    });
}); */