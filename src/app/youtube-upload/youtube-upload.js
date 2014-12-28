angular.module('ngBoilerplate.upload')

    .controller('YoutubeUploadCtrl', function UploadCtrl($scope, $http) {
        $scope.uploadedSongs = [];
        $scope.videos = [];

        $scope.searchVideos = function () {
            var params = {q: $scope.youtubeurl||''};
            $http.get('/youtube/search', {params: params})
                .success(function (data) {
                    $scope.videos = data.result;
                });
        };

        $scope.sendUrl = function (id) {
            var msg = {
                youtubeurl: 'https://www.youtube.com/watch?v=' + id
            };
            $scope.uploadedSongs.push({
                url: msg.youtubeurl,
                finished: false
            });
            $http.post('/youtube/', msg)
                .success(function (data) {
                    // file is uploaded successfully
                    for (var i = 0; i < $scope.uploadedSongs.length; i++) {
                        if ($scope.uploadedSongs[i].url === msg.youtubeurl) {
                            $scope.uploadedSongs[i].finished = true;
                        }
                    }
                });
        };
    });
