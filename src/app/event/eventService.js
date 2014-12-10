angular.module('songster.eventService')
    .factory('eventService', function ($http) {
        var service = {};
        var eventActive=false;
        var eventdata={};

        $http.get('/event/current')
            .success(function (data) {
                eventdata=data;
                if (_.isEmpty(data)) {
                    eventActive = false;
                    //Set standard values
                }
                else {
                    eventActive = true;
                }
            });

        service.isEventActive=function(){
            return eventActive;
        };

        service.setEventActive=function(active){
            eventActive=active;
        };

        service.setEventData = function(data){
            eventdata=data
        };

        service.getEventData = function(){
            return eventdata;
        };

        return service;
    });