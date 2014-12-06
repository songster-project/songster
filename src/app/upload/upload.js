angular.module('ngBoilerplate.upload')

    .controller('UploadCtrl', function UploadCtrl($scope, $upload, $http, $player) {
        $scope.uploadedFiles = [];
        $scope.player = $player;

        // generic function to remove elements from an ng-repeat array
        $scope.remove = function (array, index) {
            array.splice(index, 1);
        };

        $scope.onFileSelect = function ($files) {
            // $files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];

                $scope.uploadedFiles.push({
                    name: file.name,
                    finished: false
                });

                // also check this server side
                if ("mp3" === file.name.substr(-3)) {
                    $scope.upload = $upload.upload({
                        url: '/song/',
                        method: 'POST',
                        headers: {'Content-Type': file.type},
                        data: {myObj: $scope.myModelObj},
                        file: file
                    }).success(function (data, status, headers, config) {
                        // file is uploaded successfully
                        for (var i = 0; i < $scope.uploadedFiles.length; i++) {
                            if ($scope.uploadedFiles[i].name === file.name) {
                                $scope.uploadedFiles.splice(i, 1);
                            }
                        }
                        $scope.uploadedFiles.push({
                            name: file.name,
                            finished: true
                        });
                    });
                }
            }
        };

        $http.get('/song/')
            .success(function (data) {
                $scope.songs = data;

                $scope.mediaPlaylist = [];
                data.forEach(function (element) {
                    $scope.mediaPlaylist.push({
                        src: '/song/' + element.file_id + '/raw',
                        type: 'audio/mp3'
                    });
                });
            });


        // TODO this should be moved to the library controller
        $scope.updateSongMetadata = function(song) {
            if (song && song._id) {
                return $http.put('/song/' + song._id, song);
            } else {
                return false;
            }
        };

        // TODO this should be moved to the library controller
        $scope.updateCover = function(song) {
            if (song && song._id) {
                $http.put('/song/' + song._id + '/updateCover', song)
                    .success(function(data, status, headers, config) {
                        song.cover = data.cover;
                    });
            } else {
                console.log('updateCover() got passed an invalid song');
            }
        };
    })

    .run(function ($rootScope) {
        $rootScope.seekPercentage = function ($event) {
            var percentage = ($event.offsetX / $event.target.offsetWidth);
            if (percentage <= 1) {
                return percentage;
            } else {
                return 0;
            }
        };
    }
);
