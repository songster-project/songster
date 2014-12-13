angular
    .module('songster.event.services')
    .provider('$event', EventProvider);


function Event($http, $q) {

    var _event = undefined;

    this.loadCurrentEvent = function () {
        var deferred = $q.defer();
        $http.get('/event/current').success(function (data) {
            var event = data;
            // TODO create domain object
            _event = event;
            deferred.resolve(event);
        }).error(function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    this.loadEvent = function (eventId) {
        var deferred = $q.defer();
        $http.get('/event/' + eventId).success(function (data) {
            var event = data;
            // TODO create domain object
            _event = event;
            deferred.resolve(event);
        }).error(function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    this.getEvent = function () {
        return _event;
    };

    this.setEvent = function (event) {
        _event = event;
    }
}

function EventProvider() {
    this.$get = function ($http, $q) {
        return new Event($http, $q);
    };
}