angular
    .module('songster.eventHistory.providers')
    .provider('$eventHistory', EventHistoryProvider);


function EventHistory($http) {

    this.getPastEvents = function (assign) {
        $http.get('/event/past')
            .success(function (data) {
                assign(data);
            });
    };

    this.getSongsFor = function (event, assign) {
        $http.get('/eventlog/songs/' + event._id)
            .success(function (data) {
                console.log(data);//  assign(data);
            });
        //Currently here because the eventlog in the master is broken and the fix is in the glorious voting_v3 branch
        var data = [{
            "type": "songplayed",
            "message": "{\"nextSongs\":[],\"currentSong\":{\"id\":\"548eb3795dead6760908f7dd\",\"_id\":\"548eb3795dead6760908f7dd\",\"title\":\"Money (That's What I Want)\",\"artist\":\"The Beatles\",\"album\":\"With the Beatles (2009 Stereo Remaster)\",\"year\":\"2009\",\"cover\":\"548eb3734bb971760975bcb5\",\"file_id\":\"548eb36d4bb971760975bc63\",\"addedDate\":\"2014-12-15T10:09:49.824Z\",\"src\":\"/song/548eb36d4bb971760975bc63/raw\",\"type\":\"audio/mp3\"}}",
            "event_id": {"$oid": "548eb4134bb971760975bcba"},
            "_id": {"$oid": "548eb4154bb971760975bcbb"},
            "logDate": {"$date": 1418638357345},
            "__v": 0
        },
            {
                "type": "songplayed",
                "message": "{\"nextSongs\":[],\"currentSong\":{\"id\":\"548eb3795dead6760908f7dd\",\"_id\":\"548eb3795dead6760908f7dd\",\"title\":\"Money (That's What I Want)\",\"artist\":\"The Beatles\",\"album\":\"With the Beatles (2009 Stereo Remaster)\",\"year\":\"2009\",\"cover\":\"548eb3734bb971760975bcb5\",\"file_id\":\"548eb36d4bb971760975bc63\",\"addedDate\":\"2014-12-15T10:09:49.824Z\",\"src\":\"/song/548eb36d4bb971760975bc63/raw\",\"type\":\"audio/mp3\"}}",
                "event_id": {"$oid": "548eb4134bb971760975bcba"},
                "_id": {"$oid": "548eb4154bb971760975bcbc"},
                "logDate": {"$date": 1418638357442},
                "__v": 0
            }
        ];
        assign(data);
        return;
    };
}

function EventHistoryProvider() {
    this.$get = function ($http) {
        return new EventHistory($http);
    };
}