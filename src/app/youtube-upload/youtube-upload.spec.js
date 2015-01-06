describe('YoutubeUpload', function () {
    var $scope, $http, func;

    beforeEach(module('ngBoilerplate.upload'));

    beforeEach(inject(function ($controller, $rootScope) {
        var f={
            success:function(data){
                func=data;
            }
        };
        $http={
            post:function(data) {
            },
            get:function(data){
            }
        };
        spyOn($http, 'get').andReturn(f);
        spyOn($http, 'post').andReturn(f);
        $scope = $rootScope.$new();
        $controller('YoutubeUploadCtrl', {$scope: $scope, $http: $http});
    }));

    it('should search Videos', function () {
        $scope.youtubeurl='';
        $scope.uploadedSongs = [];
        $scope.videos = [];
        $scope.searchVideos();
        func({result:'test'});
        expect($http.get).toHaveBeenCalled();
        expect($scope.videos).toBe('test');
    });

    it('should send URL', function () {
        $scope.youtubeurl='';
        $scope.uploadedSongs = [{url:'asdf'}];
        $scope.videos = [];
        $scope.sendUrl('test');
        func('');
        expect($http.post).toHaveBeenCalled();
        expect($scope.uploadedSongs[1].finished).toBeTruthy();
    });
});