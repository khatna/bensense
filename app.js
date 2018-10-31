/*
Khatna Bold
Real Time Triple Double Information
*/
const rp    = require("request-promise");
const nba   = require("./src/nba");
const stats = require("./src/stats");

const allPlayers = { 
	uri: "http://data.nba.net/10s/prod/v1/2018/players.json",
	json: true
};

// the name of the player, from the command line
const first = process.argv[2];
const last  = process.argv[3];

let player;   // Player object
let teamId;   // Player's team ID
let today;    // Today's date (NBA Format)
let nextGame; // Does the player have a game today?

//==============================================================================

init(first, last).then(() => {
	if (today === nextGame.startDateEastern) {
		// set interval for triple double check
	} else {
		console.log(`${first} ${last} doesn't have a game today!`);
	}
});

//==============================================================================
// fetch json file for all players, and grab player's ID and his teamId
async function init(first, last) {
  // Fetch today's date to find games
  nba.fetchDate()
  .then(date => { 
    today = date; 
    return today;
  })
  .then(today => console.log(`Today's date (YYYYMMDD): ${today}\n`));
  
  // fetch all players, get info about one player and populate variables
  await rp(allPlayers)
		.then(async players => {
			player = nba.grabPlayer(players, first, last);
			if (player) {
				teamId   = player.teamId;
				let teamTri  = await nba.getTricode(teamId);
				
			  console.log(`${first} ${last} successfully found`);
				console.log(`${first} ${last} Team: ${teamTri}`);
			} else {
				console.log(`${first} ${last} not found!\n`);
			}
		})
		.catch(function(err) {
			console.log(`Could not complete fetch: ${err}\n`);
		});
		
	// if player exists, check if his team has a game tonight
	if (player) {
	  nextGame = await nba.nextGame(teamId);
	  let date = nextGame.startDateEastern;
  	console.log(`${first} ${last} has his next game on: ${date}\n`);
	}
}