angular.module('ngBoilerplate.upload')

    .controller('YoutubeUploadCtrl', function UploadCtrl($scope, $upload, $http) {
        $scope.uploadedSongs = [];

        $scope.sendUrl = function () {
            var msg = {
                youtubeurl: $scope.youtubeurl
            };
            $scope.uploadedSongs.push({
                name: $scope.youtubeurl,
                finished: false
            });
            $http.post('/youtube/', msg)
                .success(function (data) {
                    // file is uploaded successfully
                    for (var i = 0; i < $scope.uploadedSongs.length; i++) {
                        if ($scope.uploadedFiles[i].name === config.file.name) {
                            $scope.uploadedFiles[i].finished = true;

                        }
                    }
                });
        };
    });
