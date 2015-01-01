angular.module('songster.suggest')

    .controller('SuggestController', function SuggestController($scope, $rootScope, $http, $state, $stateParams, votingService, $event, $websocket, $suggestService) {


        $scope.event =  $scope.event = $event.getEvent();
        $scope.videos = [];
        $scope.suggests_vidoeid = [];

        $scope.searchVideos = function() {
            var params = {q: $scope.youtubeurl||''};
            $http.get('/youtube/search', {params: params})
                .success(function (data) {
                    $scope.videos = data.result;
                });
        }

        $scope.suggest = function (videoId) {

            $scope.suggests_vidoeid[videoId] = true;
            $suggestService.postSuggest(videoId, $scope.event._id);

        }

        $scope.disableSuggestButton = function (videoId) {
            return $scope.suggests_vidoeid[videoId] !== undefined ? true : false;
        }

    });