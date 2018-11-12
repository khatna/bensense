/*
Khatna Bold
Real Time Triple Double Information
*/

const stats = require("./src/stats");
const main  = require("./src/main");

// the name of the player, from the command line
let first = process.argv[2];
let last  = process.argv[3];

//==============================================================================
main.init(first, last)
.then((player) => {
	// player was found and has a game today
	if (player && player.hasGameToday) {

		// use correct spelling (e.g. Lebron => LeBron)
		first = player.firstName;
		last  = player.lastName;

		var checking = setInterval(async () => {

			let statLine = await stats.getStatline(first, last, player.nextGame);

			if (!statLine) {
				clearInterval(checking);
				return;
			}

			
			// triple double completed!
			if (stats.hasTripleDouble(statLine)) {
				console.log(`${first} ${last} has completed a triple double!`);
				clearInterval(checking);
			}

			// currently in-game, but hasn't completed a triple double yet
			else if (statLine) {
				console.log("No triple double yet");
			}

			// game ended before the player completes a triple double
			else if (await stats.gameIsOver(player.nextGame)) {
				console.log("Game ended.");
				clearInterval(checking);
			}
			
			console.clear();
			stats.printStatline(first, last, statLine);
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