require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);

var getArtistNames = function (artist) {
    return artist.name;
};


var getSpotify = function (songName) {
    if (songName === undefined) {
        songName = "why you do dat?";
    }

    spotify.search(
        {
            type: "track",
            query: songName
        },
        function (err, data) {
            if (err) {
                console.log("There has been an error. Please try again! Error:" + err)
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist: " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
            }
        }
    );
};

var getBands = function (artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=3c899c8648721652ad892222f1449bca";
        axios.get(queryURL).then(
            function (response) {
                var jsonData = response.data;
                    console.log(jsonData)
                if (!jsonData.length) {
                    console.log("There are no results for " + artist)
                    return;
                }

                console.log("Upcoming concerts for " + artist);

                for (var i = 0; i < jsonData.length; i++) {
                    var show = jsonData[i];

                    console.log(
                        show.venue.city +
                        "," +
                        (show.venue.region || show.venue.country) +
                        " at " +
                        show.venue.name +
                        " " +
                        moment(show.datetime).format("MM/DD/YYYY")
                    );
                }
            }

        );

};

var getMovie = function (movieName) {
    if (movieName === undefined) {
        movieName = "how high";
    }

    var urlHit = "http://www.omdbapi.com/?t=" + movieName +  "&y=&plot=full&tomatoes=true&apikey=b04efe82";

    axios.get(urlHit).then(
        function (response) {
            var jsonData = response.data;

            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
        }
    );
};

var doTheText = function () {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);

        var dataArr = data.split(", ");

        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};

//function to determine the command
var pick = function (caseData, functionData) {
    switch (caseData) {
        case "concert-this":
            getBands(functionData);
            break;
        case "spotify-this-song":
            getSpotify(functionData);
            break;
        case "movie-this":
            getMovie(functionData);
            break;
        case "do-this-text":
            doTheText();
            break;
        default:
            console.log("LIRI dont do dat!");
    }
};

var runThis = function (argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv.slice(3).join(" "));