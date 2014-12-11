angular.module('songster.voting')

    .controller('VotingCtrl', function VotingCtrl($scope,$rootScope, $http, $state, $stateParams) {
        $scope.eventid = $stateParams.eventid;
        $scope.songs =  [];
        $scope.message = "";
        $scope.actions = [
            {
                'title': 'Vote for song',
                'icon': 'fa-star',
                'fn': function(song) {
                    $http.get('/account/id').success(function (data){
                        var vote =  {
                            owner_id: data.id,
                            event_id: $scope.eventid,
                            song_id: song._id._id,
                            type: 'vote',
                            state: 'new'
                        };

                        $http.post('/voting/' + $scope.eventid, vote).
                            success(function(data, status, headers, config){

                        }).
                            error(function(data, status, headers, config){
                                // implement error handling
                            });
                    });

                }
                /*    votingService.postVote($scope.event_id, song._id._id).
                        success(function(data, status, headers, config){
                            votingService.loadVotes($scope.event_id);
                        }).
                        error(function(data, status, headers, config){
                            // implement error handling
                        });

                } */
            }
        ];

        $http.get('/voting/votedsongs/' + $scope.eventid).
            success(function(data, status, headers, config){
            $scope.songs = data;
        }).
        error(function( data, status, headers, config){
                $scope.message = status;
            });

/*        votingService.loadVotes($scope.event_id).
            success(function(data, status, headers, config){
                $scope.songs = data;
            });
*/
        $scope.hasActions = function() {
            return !_.isEmpty($scope.actions);
        };

        //ToDo: Manuel => as discussed in the last week of september, you said you are going to continue at this point
        //by going to manage that the availability of the menu ...
        $rootScope.anonymousUser = !!$state.current.data.anonymous;
    });

