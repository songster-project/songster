describe('player', function () {
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

    describe('dummy', function () {
        it('should be truthy', function () {
            expect(true).toBeTruthy();
        });
    });

});