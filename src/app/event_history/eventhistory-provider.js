angular
    .module('songster.eventhistory.providers')
    .provider('$eventhistory', EventHistoryProvider);


function EventHistory($http) {

    this.getPastEvents = function() {
        //ToDo: Show here my past events
       return [{name: "1"},{ name: "2"},{name: "3"}];
    };

    this.getSongsFor = function(event) {
        //ToDo: Request here the stuff i need
        return [{name: event.name},{ name: "2"}];
    };
}

function EventHistoryProvider() {
    this.$get = function ($http) {
        return new EventHistory($http);
    };
}