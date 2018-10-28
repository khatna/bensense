const rp = require("request-promise");

const prefix = "http://data.nba.net/10s/prod";

var nba = {};

// grabs player object if found from first and last names
nba.grabPlayer = (players, first, last) => {
	for (let player of players.league.standard) {
		if (player.firstName === first && player.lastName === last)
			return player;
	}
};

// does player's team have a game today?
nba.teamHasGame = async (teamId, date) => {
  return rp({uri: `${prefix}/v1/2018/teams/${teamId}/schedule.json`, json:true})
    .then(json => {
      var i = json.league.lastStandardGamePlayedIndex;
      var nextGame = json.league.standard[i+1];
      console.log(nextGame.startDateEastern === date);
      return nextGame.startDateEastern === date;
    })
    .catch(err => console.log(err));
};

// get the tricode (e.g. PHI) for given team id
nba.getTricode = async (id) => {
	let tricode;
	await rp({uri: `${prefix}/v2/2018/teams.json`, json: true})
		.then(teams => {
			for (let team of teams.league.standard) {
				if (team.teamId === id)
					tricode = team.tricode;
			}
		});
	return tricode;
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