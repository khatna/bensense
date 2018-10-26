const rp = require("request-promise");

const prefix = "http://data.nba.net/10s";

var nba = {};

// grabs player object if found from first and last names
nba.grabPlayer = (players, first, last) => {
	for (let player of players.league.standard) {
		if (player.firstName === first && player.lastName === last)
			return player;
	}
};

// does player's team have a game today?
// TODO

// get the tricode (e.g. PHI) for given team id
nba. getTricode = async (id) => {
	let tricode;
	await rp({uri: `${prefix}/prod/v2/2018/teams.json`, json: true})
		.then(teams => {
			for (let team of teams.league.standard) {
				if (team.teamId === id)
					tricode = team.tricode;
			}
		});
	return tricode;
};

module.exports = nba;