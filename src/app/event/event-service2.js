angular
    .module('songster.event.services')
    .provider('$event', EventServiceProvider);


function EventService($http, $q, $rootScope) {

    var _broadcastEvent = undefined;
    var _event = undefined;

    var EVENT_BROADCAST_STARTED = 'BROADCAST_STARTED';
    var EVENT_BROADCAST_STOPPED = 'BROADCAST_STOPPED';

    this.loadEvent = function (eventId) {
        var deferred = $q.defer();
        $http.get('/event/' + eventId).success(function (data) {
            var event = new window.Event(data);
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
            // check if we get an empty event from the server
            // this means, that we have no current event ongoing
            if (_.isEmpty(data)) {
                data = undefined;
            }

            if (!!data) {
                _broadcastEvent = new window.Event(data);
                $rootScope.$broadcast(EVENT_BROADCAST_STARTED, _broadcastEvent)
            } else {
                $rootScope.$broadcast(EVENT_BROADCAST_STOPPED)
            }

            deferred.resolve(_broadcastEvent);
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
                    var broadcastEvent = new window.Event(data);
                    $rootScope.$broadcast(EVENT_BROADCAST_STARTED, broadcastEvent);
                    _broadcastEvent = broadcastEvent;
                    deferred.resolve(broadcastEvent);
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
        return _broadcastEvent !== undefined && _broadcastEvent._id == _event._id;
    };

    this.getEvents = function () {
        var deferred = $q.defer();
        // TODO load from backend
        if (!!_broadcastEvent) {
            deferred.resolve([_broadcastEvent]);
        } else {
            deferred.resolve([]);
        }
        return deferred.promise;
    };
}

function EventServiceProvider() {
    this.$get = function ($http, $q, $rootScope) {
        return new EventService($http, $q, $rootScope);
    };
}