angular.module('ngBoilerplate.upload')

    .controller('UploadCtrl', function UploadCtrl($scope, $upload) {
        $scope.uploadedFiles = [];

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
                            if ($scope.uploadedFiles[i].name === config.file.name) {
                                $scope.uploadedFiles[i].finished = true;
                            }
                        }
                    });
                }
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
