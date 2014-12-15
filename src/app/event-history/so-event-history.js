angular
    .module('songster.eventHistory')
    .directive('soEventHistory', SoEventHistoryDirective);

function SoEventHistoryDirective() {
    return {
        restrict: 'AE',
        scope: {
            eventId: "="
        },
        controller: function ($scope, $http) {
            $http.get('/eventlog/songs/' + $scope.eventId)
                .success(function (data) {
                   $scope.songs=data;
                });
        },
        templateUrl: 'event-history/so-event-history.tpl.html'
    };
}
