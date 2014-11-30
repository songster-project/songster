angular.module('songster.voting')


    .config(function config($stateProvider) {
        $stateProvider.state('votingloggedin', {
            url: '/voting/:eventid',
            views: {
                "main": {
                    controller: 'VotingCtrl',
                    templateUrl: 'voting/voting.tpl.html'
                }
            },
            data: {pageTitle: 'DoTheVoting'}
        });
        $stateProvider.state('votinganon', {
           url: '/voting/:eventid/anon',
            views: {
                "main": {
                    controller: 'VotingAnon',
                    templateUrl: 'voting/voting.tpl.html'
                }
            },
            data: {pageTitle: 'voting-anon'}
        });
    })


    .controller('VotingCtrl', function VotingCtrl($scope, $http, $stateParams) {
        $scope.eventid = $stateParams.eventid;
    })

    .controller('VotingAnon', function VotingCtrl($scope, $http, $stateParams) {
        $scope.anon = true;
        $scope.eventid =  $stateParams.eventid;
    })
;