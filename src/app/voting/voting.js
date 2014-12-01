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
            data: {pageTitle: 'DoTheVoting' }
        });
        $stateProvider.state('votinganon', {
           url: '/voting/:eventid/anon',
            views: {
                "main": {
                    controller: 'VotingCtrl',
                    templateUrl: 'voting/voting.tpl.html'
                }
            },
            data: {pageTitle: 'voting-anon', anonymous : 'true'}
        });
    })
    //1. data => anon : true setzen im data blog ist im data blog
    //2. => rootScope => dort kann ich das setzen

    .controller('VotingCtrl', function VotingCtrl($scope,$rootScope, $http,$state, $stateParams) {
        $scope.eventid = $stateParams.eventid;

        //ToDo: Manuel => macht hier weiter
        $rootScope.anonymousUser = !!$state.current.data.anonymous;
    })

;