/* the stats module - for parsing box score stats and determining if player has
   triple double etc. */
const rp = require("request-promise");

// the object to be exported
let stats = {};

// prefix for all NBA box score json files
const prefix = `https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2018/scores/gamedetail/`;

// Test function 
const test => (firstName, lastName, gameId) {
	rp({ uri:`${prefix}${gameId}_gamedetail.json`, json:true })
	.then(json => {
		for (let player of json.g.vls.pstsg) {
			if (player.fn === firstName && player.ln === lastName) {
				console.log(`${lastName} points:   ${player.pts}`);
				console.log(`${lastName} assists:  ${player.ast}`);
				console.log(`${lastName} rebounds: ${player.reb}`);
			}
		}
	});
};

// UNIT TESTING
test("Stephen", "Curry", "0021800083");

module.exports = stats;