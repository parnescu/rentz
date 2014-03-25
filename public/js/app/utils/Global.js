define([
	'app/models/GameType',
	'app/models/Scoring',
],function(GameType, Scoring){
	var max = 6, min = 3, current = 3;

	_utils = {}
	_utils.plural = function(nr, str){
		return str + (nr === 1 ? "" : "s")
	}
	_utils.merge = function(data, obj){
		for (var ii in obj){
			data[ii] = obj[ii];
		}
	}

	_types = {
		RED_PRIEST: new GameType({
			type: 'redPriest',
			multiplier: -150,
			maxItems: 1
		})
		,DAMES: new GameType({
			type: 'dames',
			multiplier: -50,
			maxItems: 4		
		})
		,WHIST: new GameType({
			type: 'whist',
			multiplier: 10,
			maxItems: 8
		})
		,BROKE: new GameType({
			type: 'broke',
			multiplier: -10,
			maxItems: 8
		})
		,RENTZ: new GameType({
			type: 'rentz',
			multiplier: 50,
			maxItems: function(){ return current}
			// this should be number of players 
		})
		,DIAMONDS: new GameType({
			type: 'diamonds',
			multiplier: -10,
			maxItems: function(){ return current*2;} 
		})
		,ALL: new GameType({
			type: 'all',
			multiplier: -10,
			maxItems: function(){ return 55 - (max-current)*2;}
			// 4*queens, 1*red priest, 8*hands, 2*nrplayers * diamonds
		})
	}
		

	_events = {
		LIST_CLICK: "listItemClicked"
	}
	return {
		MIN_PLAYERS: min
		,MAX_PLAYERS: max
		,currentPlayers: current

		,events: _events
		,util: _utils
		,gameType: _types
	}
})