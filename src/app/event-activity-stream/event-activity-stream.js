/**
 * Created by Thomas on 26.12.2014.
 */
angular
    .module('songster.event-activity-stream')
    .directive('soEventActivityStream', SoEventActivityStreamDirective);

function SoEventActivityStreamDirective() {
    return {
        restrict: 'AE',
        scope: {
            eventId: "="
        },
        controller: function EventActivityStreamCtrl($scope, $websocket, $event, $rootScope, $http) {

            $scope.log = [];

            $http.get('/eventlog/songs/' + $scope.eventId)
                .success(function(data) {
                    // we ignore the first song since it should be sent via websockets
                    var idx = 0;

                    data.forEach(function (item) {
                        if (item.message && item.logDate) {
                            if (item.message.currentSong && item.message.currentSong.title !== '') {
                                if (idx != 0) {
                                    $scope.log.push({
                                        type: 'song_played',
                                        content: item.message.currentSong,
                                        date: item.logDate
                                    });
                                }
                            }
                        }
                        idx++;
                    });
                    $scope.cleanUpLog();
                });


            $http.get('/eventlog/votes/' + $scope.eventId)
                .success(function(data) {

                    data.forEach(function (item) {
                        if (item.message && item.logDate) {
                            if (item.message.vote && item.message.song && item.message.song.title) {
                                $scope.log.push({
                                    type: 'song_voted',
                                    content: item.message.song,
                                    date: item.logDate,
                                    count: 1
                                });
                            }
                        }
                    });
                    $scope.cleanUpLog();
                });

            $http.get('/eventlog/suggestions/' + $scope.eventId)
                .success(function(data) {

                    data.forEach(function (item) {
                        if (item.message && item.logDate) {
                            if (item.message.vote && item.message.song && item.message.song.title) {
                                $scope.log.push({
                                    type: 'song_suggested',
                                    content: item.message.song,
                                    date: item.logDate
                                });
                            }
                        }
                    });
                    $scope.cleanUpLog();
                });


            /*
                the following two function are meant to clean up the log
                the do the following:
                 * put the log entries into buckets
                 * "reduce" each bucket
                 * for song_played this means that we ignore entries that "close" together
                    - i.e. if someone changes songs frequently to find the right one
                 * for votes we group each bucket by song and sum up the votes
                 * "bucket interval" for played songs is 1 minute
                 * "bucket interval" for votes is 12 minutes

                 faq:
                  * is it better to do this in the backend?
                  yes

                  * why didn't you do it?
                  given the size of the event log for a single event - it doesn't really matter

                  it's also more "convienient" to do in the frontend
                  you don't have to think about how to incorporate new entries that come via websockets
                  just clean the log every time a new element is added

             */

            $scope.buildBuckets = function buildBuckets(bucketType, bucketSize) {
                var min, max;
                var buckets = [];

                $scope.log.forEach(function (item) {
                    if (item.type === bucketType) {
                        if (min == null && max == null) {
                            min = new Date(item.date);
                            max = new Date(item.date);
                        } else {
                            if (new Date(item.date) < min) {
                                min = new Date(item.date);
                            }
                            if (new Date(item.date) > max) {
                                max = new Date(item.date);
                            }
                        }
                    }
                });

                if (min  != null && max != null) {
                    var delta = Math.ceil(Math.abs(max - min) / 1000);
                    var bucketCount =  Math.ceil(delta / bucketSize);
                    var i;

                    for (i = 0; i < bucketCount; i++) {
                        buckets[i] = [];
                    }

                    for (i = 0; i < bucketCount; i++) {
                        $scope.log.forEach(function (item) {
                            if (item.type === bucketType) {
                                var deltaTime = (new Date(item.date) - min) / 1000;

                                if (deltaTime >= bucketSize * i && deltaTime < bucketSize * (i+1)) {
                                        buckets[i].push(item);
                                }
                            }
                        });
                    }
                    return buckets;
                }
            };

            $scope.cleanUpLog = function cleanUpLog() {
                // here you can change the "bucket interval"
                var songsPlayedBuckets = $scope.buildBuckets('song_played', 60);
                var songsVotedBuckets = $scope.buildBuckets('song_voted', 720);
                var i;

                // clean up played songs
                if (songsPlayedBuckets) {
                    var songsPlayedToBeRemoved = [];
                    for (i = 0; i < songsPlayedBuckets.length; i++) {
                        if (songsPlayedBuckets[i].length > 1) {

                            var max;

                            // we only keep the song with the biggest date (i.e. the one that way actually played)
                            songsPlayedBuckets[i].forEach(function(item) {
                                if (max == null) {
                                    max = item;
                                } else if (max.date < item.date) {
                                    max = item;
                                }
                            });

                            songsPlayedBuckets[i].forEach(function(item) {
                                if (item !== max) {
                                    songsPlayedToBeRemoved.push(item);
                                }
                            });
                        }
                    }

                    for (i = $scope.log.length - 1; i > -1; i--) {
                        songsPlayedToBeRemoved.forEach(function (item_to_be_removed) {
                            if ($scope.log[i] === item_to_be_removed) {
                                $scope.log.splice(i, 1);
                            }
                        });
                    }
                }

                // clean up votes
                if (songsVotedBuckets) {
                    var votesToBeRemoved = [];
                    for (i = 0; i < songsVotedBuckets.length; i++) {
                        var doneSongs = [];

                        if (songsVotedBuckets[i].length > 1) {
                            songsVotedBuckets[i].forEach(function (item) {
                                if (doneSongs.indexOf(item.content._id) == -1) {
                                    doneSongs.push(item.content._id);
                                    songsVotedBuckets[i].forEach(function (item2) {
                                        if (item.content._id === item2.content._id && item != item2) {
                                            item.count++;
                                        }
                                    });
                                } else {
                                    votesToBeRemoved.push(item);
                                }
                            });
                        }
                    }

                    for (i = $scope.log.length - 1; i > -1; i--) {
                        votesToBeRemoved.forEach(function (item_to_be_removed) {
                            if ($scope.log[i] === item_to_be_removed) {
                                $scope.log.splice(i, 1);
                            }
                        });
                    }
                }

                // sort the array by time
                $scope.log.sort(function (a, b) {
                    return new Date(b.date) - new Date(a.date);
                })
            };

            $rootScope.notifyActivityStream = function notifyActivityStream(msg) {
                if (msg) {
                    if (msg.currentSong) {
                        $scope.log.unshift({
                            type: 'song_played',
                            content: msg.currentSong,
                            date: new Date()
                        });
                    } else if (msg.type && msg.type === 'vote' && msg.state && msg.state === 'new') {
                        $scope.log.push({
                            type: 'song_voted',
                            content: msg.song,
                            date: new Date(msg.date),
                            count: 1
                        });
                    } else if (msg.type && msg.type === 'suggestion') {
                        $scope.log.push({
                            type: 'song_suggested',
                            content: msg.song,
                            date: new Date(msg.date)
                        });
                    }
                }

                $scope.cleanUpLog();
            };
        },
        templateUrl: 'event-activity-stream/event-activity-stream.tpl.html'
    };
}
