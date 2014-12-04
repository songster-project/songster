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

    .controller('Ws_ExampleCtrl', function EventCtrl($scope, nClient) {
        $scope.messages = [];
        nClient.register_to_event('lala', function (msg) {
            $scope.messages.push(msg);
            $scope.$apply();
        });
        $scope.sendmessage = function () {
            nClient.send_event('lala', '{"message":"' + $scope.message + '"}');
            $scope.message = '';
        };
    });
