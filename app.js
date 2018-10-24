var rp = require("request-promise");

var todayDate = new Date();
var today     = dateString(todayDate);

var ben;    // Object corresponding to Ben
var benId;  // Ben Simmons' ID
var teamId; // Ben Simmons' team ID (Hopefully 76ers!)

var allPlayers = { 
	uri: "http://data.nba.net/10s/prod/v1/2018/players.json",
	json: true
};

// fetch json file for all players, and grab Ben Simmons's ID
rp(allPlayers)
	.then(function(json) {
		ben  = grabSimmons(json.league.standard);
	
		if (!ben) {
			console.log("Ben Simmons not found!");
		} else {
			benId  = ben.personId;
			teamId = ben.teamId;
			console.log("Ben Simmons successfully found");
			console.log("Ben Simmons Player ID: " + benId);
			console.log("Ben Simmons Team ID:   " + teamId);
		}
	})
	.catch(function(err) {
		console.log(err);
	});

//=============================================================================

// grabs Ben Simmons object if found
function grabSimmons(players) {
	players.forEach(function(player) {
		if (player.firstName === "Ben" && player.lastName === "Simmons") {
			ben = player;
		}	
	});
	return ben;
}

// convert date to NBA date format
function dateString(date) {
	var day   = String(date.getDate());
	var month = String(date.getMonth() + 1);
	var year  = String(date.getYear());
	
	if (month < 10) month = "0" + month;
	
	return year + month + day;
}




