angular
    .module('songster.player.services')
    .provider('$player', PlayerProvider);


function PlayerProvider() {
    this.$get = function () {
        // TODO implement player serivce
        return function () {
        };
    };
}