/*
Khatna Bold
Real Time Triple Double Information
*/

const stats   = require("./src/stats");
const players = require("./src/players");

// the name of the player, from the command line
let first = process.argv[2];
let last  = process.argv[3];

//==============================================================================
players.find(first, last)
.then((player) => {
	// player was found and has a game today
	if (player && player.hasGameToday) {

		// use correct spelling (e.g. Lebron => LeBron)
		first = player.firstName;
		last  = player.lastName;

		let oldStatline, statline;
		var checking = setInterval(async () => {
			statline = await stats.getStatline(first, last, player.nextGame);

			if (!statline) {
				clearInterval(checking);
				return;
			}
			
			// triple double completed!
			if (stats.hasTripleDouble(statline)) {
				console.log(`${first} ${last} has completed a triple double!`);
				clearInterval(checking);
			}

			// game ended before the player completes a triple double
			if (await stats.gameIsOver(player.nextGame)) {
				console.log("Game ended.");
				clearInterval(checking);
			}
			
			// print stats if they change
			if (JSON.stringify(statline) !== JSON.stringify(oldStatline)) {
				console.clear();
				stats.printStatline(first, last, statline);
				oldStatline = statline;
			}

		}, 5000);

	}
	// player found but doesn't have a game
	else if (player) {
		console.log(`${first} ${last} doesn't have a game today!`);
	}
	// player wasn't found
	else {
		console.log(`${first} ${last} not found!\n`);
	}
});