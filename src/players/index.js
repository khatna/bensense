const nba = require("../nba");
const rp = require("request-promise");
const year = require('../yearsvc');
// json file containing all players
const allPlayers = {
	uri: `http://data.nba.net/10s/prod/v1/${year}/players.json`,
	json: true
};

// export module
let players = {};

// searches json file for all players, and grabs player's ID and his teamId
players.find = async (first = "Ben", last = "Simmons") => {
	// the player object corresponding to [fist] [last]
	let player;
	// today's date, in NBA json format
	let today = await nba.fetchDate();
	console.log(`Today's date (YYYYMMDD): ${today}\n`);

	// populate 'player' with the correct player object, if found
	await rp(allPlayers)
		.then(async players => {
			player = nba.grabPlayer(players, first, last);

			if (player) {
				let teamTri = await nba.getTricode(player.teamId);
				console.log(`${first} ${last} successfully found`);
				console.log(`${first} ${last} Team: ${teamTri}`);
			}
		})
		.catch(function (err) {
			console.log(`Could not complete fetch: ${err}\n`);
		});

	// if player exists, fetch his next game and return a popualted object
	if (player) {
		let nextGame = await nba.nextGame(player.teamId);
		let gameDate = nextGame.startDateEastern;
		let opponentId = nba.getOpponent(player.teamId, nextGame);
		let opponent = await nba.getTricode(opponentId);

		console.log(`${first} ${last}'s next game is on ${gameDate} against ${opponent}\n`);

		return {
			firstName: player.firstName,
			lastName: player.lastName,
			teamId: player.teamId,
			nextGame: nextGame,
			hasGameToday: today === gameDate,
		};
	} else return null;
};

module.exports = players;