angular
    .module('songster.eventhistory.providers')
    .provider('$eventhistory', EventHistoryProvider);


function EventHistory($http) {

    this.getPastEvents = function() {
       return [{name: "1"},{ name: "2"},{name: "3"}];
    };
}

function EventHistoryProvider() {
    this.$get = function ($http) {
        return new EventHistory($http);
    };
}