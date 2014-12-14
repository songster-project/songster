angular
    .module('songster.event.services')
    .provider('$event', EventProvider);


function Event($http, $q, $rootScope) {

    var _broadcastEvent = undefined;
    var _event = undefined;

    var EVENT_BROADCAST_STARTED = 'BROADCAST_STARTED';
    var EVENT_BROADCAST_STOPPED = 'BROADCAST_STOPPED';

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

    this.loadBroadcastEvent = function () {
        var deferred = $q.defer();
        $http.get('/event/current').success(function (data) {
            var event = data;
            // TODO create domain object

            // check if we get an empty event from the server
            // this means, that we have no current event ongoing
            if (_.isEmpty(event)) {
                event = undefined;
            }

            _broadcastEvent = event;
            _event = event; // because it is also in current event view

            // notifiy our listeners
            event !== undefined ?
                $rootScope.$broadcast(EVENT_BROADCAST_STARTED, event) :
                $rootScope.$broadcast(EVENT_BROADCAST_STOPPED);

            deferred.resolve(event);
        }).error(function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    this.startBroadcast = function (event) {
        var deferred = $q.defer();
        $http.get('/account/id').success(function (data) {
            // TODO two calls are not necessary in my opinion (MG)
            event.owner_id = data.id;
            $http.post('/event', event).
                success(function (data, status, headers, config) {
                    $rootScope.$broadcast(EVENT_BROADCAST_STARTED, event);
                    _broadcastEvent = event;
                    _event = event;
                    deferred.resolve(event);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(data);
                });
        });
        return deferred.promise;
    };

    this.stopBroadcast = function () {
        var deferred = $q.defer();
        $http.put('/event/current/end', {}).
            success(function (data, status, headers, config) {
                _broadcastEvent = undefined;
                $rootScope.$broadcast(EVENT_BROADCAST_STOPPED);
                deferred.resolve(event);
            }).
            error(function (data, status, headers, config) {
                deferred.reject(data);
            });
        return deferred.promise;
    };

    this.getBroadcastEvent = function () {
        return _broadcastEvent;
    };

    this.getEvent = function () {
        return _event;
    };

    this.isDj = function() {
        return _broadcastEvent !== undefined && _broadcastEvent == _event ? true : false;
    }

}

function EventProvider() {
    this.$get = function ($http, $q, $rootScope) {
        return new Event($http, $q, $rootScope);
    };
}