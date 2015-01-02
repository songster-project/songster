angular.module('songster.suggest')

    .controller('SuggestController', function SuggestController($scope, $rootScope, $http, $state, $stateParams, votingService, $event, $websocket, $suggestService) {


        $scope.event =  $scope.event = $event.getEvent();
        $scope.videos = [];

        $scope.searchVideos = function() {
            var params = {q: $scope.youtubeurl||''};
            $http.get('/youtube/search', {params: params})
                .success(function (data) {
                    if(data) {
                        $scope.videos = data.result;
                    }
                });
        }

        $scope.suggest = function (videoId) {

            $suggestService.addActiveClientYoutubeSuggestion(videoId);
            $suggestService.postSuggest(videoId, $scope.event._id);

        }

        $scope.disableSuggestButton = function (videoId) {
            return $suggestService.hasClientActiveSuggestedYoutubeVideo(videoId);
        }

        var data = {
            eventid: $scope.event._id
        };

        $websocket.register_to_event('suggestion_played', function (suggestion) {
            console.log('suggest-controller in suggestion played event')
            if(suggestion.suggestion_type === 'youtube') {
               $suggestService.removeActiveClientYoutubeSuggestion(suggestion.video_id);
               $scope.$apply();
            } else {
                // TODO remove client song suggestion
            }
        }, data);

        // init load of client suggestions
        $suggestService.loadClientSuggestionsFromServer($scope.event._id);

    });