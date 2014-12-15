angular
    .module('songster.eventHistory.providers')
    .provider('$eventHistory', EventHistoryProvider);


function EventHistory($http) {

    this.getPastEvents = function(assign){

    $http.get('/event/past')
        .success(function (data) {
            assign(data);
        });
    };

    this.getSongsFor = function(event) {
        //ToDo: Request here the stuff i need
        //.../eventlog/songs/:id
        return [{name: event.name},{ name: "2"}];
    };
}

function EventHistoryProvider() {
    this.$get = function ($http) {
        return new EventHistory($http);
    };
}