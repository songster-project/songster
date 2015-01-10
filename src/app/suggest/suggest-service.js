angular
    .module('songster.suggest.services.suggestService')
    .provider('$suggestService', function () {
        this.$get = function ($http, votingService, PostingSuggestFactory, ReceivedVoteFactory, $event) {
            return new SuggestService($http, votingService, PostingSuggestFactory, ReceivedVoteFactory, $event);
        };
    });

function SuggestService($http, votingService, PostingSuggestFactory, ReceivedVoteFactory, $event) {
    var _self = this;
    var uploadedSongs = [];
    var _activeClientYoutubeSuggestions = {}; // active youtube suggestions of current user - for disableButton - indexed by videoId
    var _allClientYoutubeSuggestions = []; // all youtube suggestion of current user - contain ReceivedVote objects

    this.postSuggest = function (videoId, event_id) {

        if(hasClientAlreadySuggestedYoutubeVideo(videoId)) {
            // post suggest on song id of already stored youtube video
            var song_id = getSongOfVideoIfClientAlreadySuggestedYoutubeVideo(videoId);
            var suggest = PostingSuggestFactory.create({event_id: event_id, song_id: song_id, suggestion_type: 'youtube', video_id: videoId});
            $http.post('/voting/' + event_id, suggest).success(function () {
                votingService.addClientVote(song_id);
            }).error(function (err) {
                _self.removeActiveClientYoutubeSuggestion(videoId);
            });

        } else {
            // upload youtube to user library
            var msg = {
                youtubeurl: 'https://www.youtube.com/watch?v=' + videoId
            };
            uploadedSongs.push({
                url: msg.youtubeurl,
                finished: false
            });
            $http.post('/youtube/', msg)
                .success(function (data) {
                    // file is uploaded successfully
                    for (var i = 0; i < uploadedSongs.length; i++) {
                        if (uploadedSongs[i].url === msg.youtubeurl) {
                            uploadedSongs[i].finished = true;
                        }
                    }

                    var suggest = PostingSuggestFactory.create({event_id: event_id, song_id: data.id, suggestion_type: 'youtube', video_id: videoId});
                    $http.post('/voting/' + event_id, suggest).success(function () {
                        votingService.addClientVote(data.id);
                    }).error(function (err) {
                        _self.removeActiveClientYoutubeSuggestion(videoId);
                    });
                })
                .error(function (err) {
                    _self.removeActiveClientYoutubeSuggestion(videoId);
                    console.log(err);
                });
        }
    };

    this.removeActiveClientYoutubeSuggestion = function(videoId) {
        delete _activeClientYoutubeSuggestions[videoId];
    };

    this.addActiveClientYoutubeSuggestion = function(videoId) {
        _activeClientYoutubeSuggestions[videoId] = true;
    };

    this.hasClientActiveSuggestedYoutubeVideo = function(videoId) {
        return _activeClientYoutubeSuggestions[videoId] !== undefined ? true : false;
    };

    this.addClientYoutubeSuggestionToAll = function(suggestion) {
        _allClientYoutubeSuggestions.push(suggestion);
    };

    function getSongOfVideoIfClientAlreadySuggestedYoutubeVideo (videoId) {
        var suggestion = _.find(_allClientYoutubeSuggestions, { 'video_id': videoId });
        return suggestion !== undefined ? suggestion.song._id : undefined;
    }

    function hasClientAlreadySuggestedYoutubeVideo (videoId) {
        var suggestion = _.find(_allClientYoutubeSuggestions, { 'video_id': videoId });
        return suggestion !== undefined ? true : false;
    }

    this.loadClientSuggestionsFromServer = function (event_id) {
        if(!$event.isDj()) {
            $http.get('/voting/usersuggestions/' + event_id).success(function(data, status, headers, config) {
                _activeClientYoutubeSuggestions = {};
                _.each(data, function(suggestion) {
                    var suggestion = ReceivedVoteFactory.create(suggestion);
                    if(suggestion.suggestion_type === 'youtube' && suggestion.video_id) {
                        _self.addClientYoutubeSuggestionToAll(suggestion);
                        if(suggestion.state === 'new') {
                            _self.addActiveClientYoutubeSuggestion(suggestion.video_id)
                        }
                    }
                });
            }).error(function() {
                console.log('suggestService - load client suggestions error');
            });

        }

    };
}
