angular
    .module('songster.eventhistory.providers')
    .provider('$eventhistory', EventHistoryProvider);


function EventHistory($http) {

    this.getPastEvents = function() {
        $http.get('/event/current')
            .success(function (data) {
                return data;
            });

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