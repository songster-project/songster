angular
    .module('songster.library.services')
    .service('NotificationService', NotificationService);


function NotificationService($rootScope) {
    return {
        subscribe: function(scope, callback) {
            var handler = $rootScope.$on('notification-service-event', callback);
            scope.$on('$destroy', handler);
        },

        notify: function() {
            $rootScope.$emit('notification-service-event');
        }
    };
}
