angular.module('songster.ws_example')

    .config(function config($stateProvider) {
        $stateProvider.state('ws_example', {
            url: '/ws_example',
            views: {
                "main": {
                    controller: 'Ws_ExampleCtrl',
                    templateUrl: 'ws_example/ws_example.tpl.html'
                }
            },
            data: {pageTitle: 'Example for Websockets'}
        });
    })

    .controller('Ws_ExampleCtrl', function EventCtrl($scope, $http) {
        $scope.messages = [];
        var ws = new WebSocket("ws://"+location.hostname + ":" + location.port + "/notification_example");
        $scope.sendmessage = function () {
            ws.send('{"message":"' + $scope.message + '"}');
        };
        ws.onmessage = function (event) {
            $scope.messages.push({value: event.data});
            $scope.$apply();
        };

    });
