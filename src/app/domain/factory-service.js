angular
    .module('songster.domain.services')
    .provider('$factory', function() {
        this.$get = function () {
            return new FactoryService();
        };
    });

/*
 * TODO MG: this is a placeholder for the $factory service
 * This service will be used to create domain objects.
 * Instead of having multiple injects e.g. UserFactory, EventFactory,
 * we only will have on -> $factory
 *
 * To create new objects we then have to write
 * $factory.event.create() instead of EventFactory.create()
 *
 * The individual factories have to be registered to the $factory service
 * during the configuration phase
 */

function FactoryService($http, $q, $rootScope, EventFactory) {

}
