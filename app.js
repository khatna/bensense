/*
Khatna Bold
Real Time Triple Double Information
*/
const rp  = require("request-promise");
const nba = require("./src");

const allPlayers = { 
	uri: "http://data.nba.net/10s/prod/v1/2018/players.json",
	json: true
};

var prefix = "http://data.nba.net/10s";

var today;   // Today's date (NBA Format)
var benId;   // Ben Simmons' ID
var teamId;  // Ben Simmons' team ID (Hopefully 76ers!)
var teamTri; // Ben Simmons' team tricode

// fetch today's date
rp({uri: prefix + "/prod/v2/today.json", json: true})
	.then(function(json) {
		today = json.links.currentDate;
		console.log(`Today's date (YYYYMMDD): ${today}`);
	});

//==============================================================================

init();

//==============================================================================
// fetch json file for all players, and grab Ben Simmons's ID and his teamId
function init() {
  rp(allPlayers)
		.then(async players => {
			let ben  = nba.grabPlayer(players, "Ben", "Simmons");
			if (ben) {
				benId  =  ben.personId;
				teamId =  ben.teamId;
				teamTri = await nba.getTricode(teamId);
				
				console.log(`Ben Simmons successfully found`);
				console.log(`Ben Simmons Player ID:   ${benId}`);
				console.log(`Ben Simmons Team ID:     ${teamId} (${teamTri})`);
			} else {
				console.log("Ben Simmons not found!");
			}
		})
		
		.catch(function(err) {
			console.log(`Could not complete fetch: ${err}`);
		});
}