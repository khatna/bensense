const rp = require("request-promise");

const prefix = "http://data.nba.net/10s/prod";

// the object to be exported. only contains functions
let nba = {};

// grabs player object if found from first and last names
nba.grabPlayer = (players, first, last) => {
  for (let player of players.league.standard) {
    if (player.firstName === first && player.lastName === last)
      return player;
  }
};

// if the players team has a game on date, returns the game objcet. False otherwise
nba.nextGame = (teamId, date) => {
  return rp({uri: `${prefix}/v1/2018/teams/${teamId}/schedule.json`, json:true})
    .then(json => {
      let i = json.league.lastStandardGamePlayedIndex;
      return json.league.standard[i+1];
    })
  .catch(err => console.log(err));
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