angular
    .module('songster.eventhistory.providers')
    .provider('$eventhistory', EventHistoryProvider);


function EventHistory($http) {

    this.getPastEvents = function() {
       return [{name: "1"},{ name: "2"},{name: "3"}];
    };

    this.getSongsFor = function(event) {
        return [{name: event.name},{ name: "2"}];
    };
}

function EventHistoryProvider() {
    this.$get = function ($http) {
        return new EventHistory($http);
    };
}