/* the stats module - for parsing box score stats and determining if player has
   triple double etc. */
const rp = require("request-promise");

// the object to be exported
let stats = {};

// prefix for all NBA box score json files
const prefix = `https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2018/scores/gamedetail/`;

stats.getStatline = (firstName, lastName, gameId) => {
	return rp({ uri:`${prefix}${gameId}_gamedetail.json`, json:true })
	.then(json => {
		if (!json.g.hls.pstsg) {
			console.log("The game hasn't started yet!");
			return;
		}
		
		// combine home and visitor players into one array
		const players = json.g.hls.pstsg.concat(json.g.vls.pstsg);
		
		let found = false;
		let foundPlayer;
		
		// finding player
		for (let player of players) {
			if (player.fn === firstName && player.ln === lastName) {
				foundPlayer = player;
				found = true;
			}
		}
		
		if (!found) {
			console.log(`Player ${firstName} ${lastName} isn't active`);
			return;
		} else {
			let {pts, ast, reb, stl, blk} = foundPlayer;
			return [Number(pts), Number(ast), Number(reb), Number(stl), Number(blk)];
		}
	});
}; 

// prints players's statline to the console
stats.printStatline = async (first, last, gameId) => {
	const statLine = await stats.getStatline(first, last, gameId);
	if (statLine) {
		console.log(`${first} ${last} statline:
		
		Points:     ${statLine[0]}
		Assists:    ${statLine[1]}
		Rebounds:   ${statLine[2]}
		Steals:     ${statLine[3]}
		Blocks:     ${statLine[4]}`);
	}
};

// Determine if player is home or visitor

// Test function 
const test = (firstName, lastName, gameId) => {
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

// uncomment for test
// test("Stephen", "Curry", "0021800083");

module.exports = stats;