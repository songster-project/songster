angular
    .module('songster.event.services')
    .provider('$event', EventServiceProvider);


function EventService($http, $q, $rootScope, EventFactory, $account) {

    var _broadcastEvent = undefined;
    var _event = undefined;

    var EVENT_BROADCAST_STARTED = 'BROADCAST_STARTED';
    var EVENT_BROADCAST_STOPPED = 'BROADCAST_STOPPED';

    this.loadEvent = function (eventId) {
        var deferred = $q.defer();
        $http.get('/event/' + eventId).success(function (data) {
            var event = EventFactory.create(data);
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
                _broadcastEvent = EventFactory.create(data);
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
                    var broadcastEvent = EventFactory.create(data);
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

    this.deleteEvent = function (event) {
        var deferred = $q.defer();
        $http.delete('/event/notactive/' + event._id).success(function (data, status, headers, config) {
            deferred.resolve(data);
        })
            .error(function (data, status, headers, config) {
                deferred.reject(data);
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
        var user = $account.getUser();
        return _event && user && _event.owner_id == user._id;
    };

    this.isBroadcastActive = function() {
        return _broadcastEvent !== undefined;
    };

    this.isBroadcastEvent = function() {
        return _broadcastEvent !== undefined && _event !== undefined && _broadcastEvent._id == _event._id;
    };

    this.getEvents = function () {
        var deferred = $q.defer();
        $http.get('/event/past')
            .success(function (data) {
               deferred.resolve(data);
            });
        return deferred.promise;
    };

    this.shortLink = function (link) {

    };
}

function EventServiceProvider() {
    this.$get = function ($http, $q, $rootScope, EventFactory, $account) {
        return new EventService($http, $q, $rootScope, EventFactory, $account);
    };
}