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

// the name of the player (Ben Simmons by default)
var first;
var last;

var playerId;    // Player's ID
var teamId;      // Player's team ID
var teamTri;     // Player's team tricode
var today;       // Today's date (NBA Format)
var teamHasGame; // Does the player have a game today?

var td = false; // Triple Double?

//==============================================================================

init(first, last);


//==============================================================================
// fetch json file for all players, and grab player's ID and his teamId
async function init(first="Ben", last="Simmons") {
  // Fetch today's date to find games
  nba.fetchDate()
    .then(date => { 
      today = date; 
      return today;
    })
    .then(today => console.log(`Today's date (YYYYMMDD): ${today}`));
  
  // fetch all players, get info about one player and populate variables
  await rp(allPlayers)
		.then(async players => {
			let player = nba.grabPlayer(players, first, last);
			if (player) {
				playerId = player.personId;
				teamId   = player.teamId;
				teamTri  = await nba.getTricode(teamId);
				
				console.log(`${first} ${last} successfully found`);
				console.log(`${first} ${last} Player ID:   ${playerId}`);
				console.log(`${first} ${last} Team ID:     ${teamId} (${teamTri})`);
			} else {
				console.log(`${first} ${last} not found!`);
			}
		})
		.catch(function(err) {
			console.log(`Could not complete fetch: ${err}`);
		});
		
	teamHasGame = await nba.teamHasGame(teamId, today);
		
	return;
}