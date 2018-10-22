var rp = require("request-promise");

var year = new Date().getFullYear();
const allPlayers = { 
	uri: "http://data.nba.net/10s/prod/v1/"+ year +"/players.json",
	json: true
};

var ben;

// fetch json file for all players, and grab Ben Simmons's ID
rp(allPlayers)
	.then(function(json) {
		ben = grabSimmonsId(json.league);
	})
	.catch(function(err) {
		console.log(err);
	});

function grabSimmonsId(players) {
	// TODO
}