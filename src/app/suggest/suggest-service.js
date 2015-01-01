angular
    .module('songster.suggest.services.suggestService')
    .provider('$suggestService', function () {
        this.$get = function ($http, votingService, PostingSuggestFactory) {
            return new SuggestService($http, votingService, PostingSuggestFactory);
        };
    });

function SuggestService($http, votingService, PostingSuggestFactory) {
    var uploadedSongs = [];


    this.postSuggest = function (videoId, event_id) {
        // youtube song storing in user library
        var msg = {
            youtubeurl: 'https://www.youtube.com/watch?v=' + videoId
        };
        uploadedSongs.push({
            url: msg.youtubeurl,
            finished: false
        });
        console.log('before http post youtube');
        $http.post('/youtube/', msg)
            .success(function (data) {
                // file is uploaded successfully
                for (var i = 0; i < uploadedSongs.length; i++) {
                    if (uploadedSongs[i].url === msg.youtubeurl) {
                        uploadedSongs[i].finished = true;
                    }
                }

                console.log('load youtube finished - before post vote');
                var suggest = PostingSuggestFactory.create({event_id: event_id, song_id: data.id});
                $http.post('/voting/' + event_id, suggest).success(function() {
                    votingService.addClientVote(data.id);
                }).error(function(err) {
                });
            })
            .error(function (err){
                console.log('posting youtube suggestion failed in suggestService');
                console.log(err);
            });
    };




}
