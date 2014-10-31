angular.module('ngBoilerplate.upload', [
    'ui.router',
    'placeholders',
    'ui.bootstrap',
    'angularFileUpload'
])

    .config(function config($stateProvider) {
        $stateProvider.state('upload', {
            url: '/upload',
            views: {
                "main": {
                    controller: 'UploadCtrl',
                    templateUrl: 'upload/upload.tpl.html'
                }
            },
            data: { pageTitle: 'Upload files' }
        });
    })

    .controller('UploadCtrl', function UploadCtrl($scope, $upload, $http) {
        $scope.onFileSelect = function ($files) {
            // $files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];

                $scope.upload = $upload.upload({
                    url: '/song/',
                    method: 'POST',
                    headers: {'Content-Type': file.type},
                    data: {myObj: $scope.myModelObj},
                    file: file
                }).progress(function (evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
                });
            }
        };

        $http.get('/song/')
            .success(function (data) {
                $scope.songs = data;
            });
    }
);
