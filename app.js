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
let today;    // Today's date (NBA Format)
let nextGame; // Player's next game

//==============================================================================

init(first, last).then(() => {
	if (nextGame && nextGame.startDateEastern === today) {
		let ticks = 0;
		var checking = setInterval(async () => {
			
			if (await stats.hasTripleDouble(first, last, nextGame)) {
				stats.printStatline(first, last, nextGame);
				clearInterval(checking);
			} 
				
			else if (ticks % 10 === 0) {
				console.log("No triple double yet");
				stats.printStatline(first, last, nextGame);
			}
			
			ticks += 1;
		}, 6000);

	} else {
		console.log(`${first} ${last} doesn't have a game today!`);
	}
});


//==============================================================================
// fetch json file for all players, and grab player's ID and his teamId
async function init(first, last) {
	let teamId; // Player's team ID
	
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
				teamId       = player.teamId;
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
		
	// if player exists, fetch his next game
	if (player) {
		nextGame = await nba.nextGame(teamId);
		let date        = nextGame.startDateEastern;
		let opponentId  = nba.getOpponent(teamId, nextGame);
		let opponent    = await nba.getTricode(opponentId); 
	  
		console.log(`${first} ${last}'s next game is on ${date} against ${opponent}\n`);
	}
}