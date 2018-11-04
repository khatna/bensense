const rp = require("request-promise");

const prefix = "http://data.nba.net/10s/prod";

// the object to be exported. only contains functions
var nba = {};

// grabs player object if found from first and last names (case insensitive)
nba.grabPlayer = (players, first, last) => {
	const firstLower = first.toLowerCase();
	const lastLower   = last.toLowerCase();
	for (let player of players.league.standard) {
		let fNameLower = player.firstName.toLowerCase();
		let lNameLower = player.lastName.toLowerCase();
		if (fNameLower === firstLower && lNameLower === lastLower)
			return player;
	}
};

// if the players team has a game on date, returns the game objcet. False otherwise
nba.nextGame = (teamId) => {
	return rp({uri: `${prefix}/v1/2018/teams/${teamId}/schedule.json`, json:true})
		.then(json => {
			var i = json.league.lastStandardGamePlayedIndex;
			return json.league.standard[i+1];
			
		})
		.catch(err => console.log(err));
};

// returns the id of the opponent team given a game and a team
nba.getOpponent = (teamId, game) => {
	if (teamId === game.vTeam.teamId) {
		return game.hTeam.teamId;
	} else if (teamId === game.hTeam.teamId) {
		return game.vTeam.teamId;
	}
	else {
		console.log(`Team ${teamId} isn't in the game!`);
	}
};

// get the tricode (e.g. PHI) for given team id
nba.getTricode = (id) => {
	return rp({uri: `${prefix}/v2/2018/teams.json`, json: true})
		.then(teams => {
			for (let team of teams.league.standard) {
				if (team.teamId === id)
					return team.tricode;
			}  
		});
};

// fetches date according to NBA date string format from NBA data
nba.fetchDate = () => {
	return rp({uri: prefix + "/v2/today.json", json: true})
		.then(json => json.links.currentDate)
		.catch(err => {
			console.log(`Could not fetch date: ${err}`);
		});
};

module.exports = nba;
