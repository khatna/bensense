var rp = require("request-promise");

// JSONs to be parsed
var year = new Date().getFullYear();
const allPlayers = { 
	uri: "http://data.nba.net/10s/prod/v1/"+ year +"/players.json",
	json: true
};



// Ben Simmons' ID
var ben = null;

// fetch json file for all players, and grab Ben Simmons's ID
rp(allPlayers)
	.then(function(json) {
		ben = grabSimmonsId(json.league.standard);
		
		if (!ben) {
			console.log("Ben Simmons not found!");
		} else {
			console.log(ben);
		}
	})
	.catch(function(err) {
		console.log(err);
	});



// grabs Ben Simmons's ID if found
function grabSimmonsId(players) {
	players.forEach(function(player) {
		if (player.firstName === "Ben" && player.lastName === "Simmons") {
			ben = player.personId;
		}	
	});
	return ben;
}