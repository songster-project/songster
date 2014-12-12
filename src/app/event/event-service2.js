angular
    .module('songster.event.services')
    .provider('$event', EventProvider);


function Event($http, $q) {

}

function EventProvider() {
    this.$get = function ($http, $q) {
        return new Event($http, $q);
    };
}