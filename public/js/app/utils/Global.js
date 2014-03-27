define([
	'app/models/GameType',
	'app/models/Scoring',
],function(GameType, Scoring){
	var max = 6, min = 3;
	
	_utils = {}
	_utils.plural = function(nr, str){
		return str + (Number(nr) === 1 ? "" : "s")
	}
	_utils.merge = function(data, obj){
		for (var ii in obj){
			data[ii] = obj[ii];
		}
	}
	_utils.progressive = function(nr){
		var sum = 1;
		for (var i=2;i<=nr;i++) { sum += i; }
		return sum;
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
			maxItems: function(){ return _utils.progressive(current)}
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
		,LIST_CHANGE_VALUE: "valueChanged"
		,LIST_MODIFY_VALUE: "valueChangedByUser"
	}

	
	var obj = {
		MIN_PLAYERS: min
		,MAX_PLAYERS: max
		,events: _events
		,util: _utils
		,gameType: _types
	}
	obj.__defineSetter__('currentPlayers', function(val){
		current = val;
	})
	obj.__defineGetter__('currentPlayers', function(){
		return current;
	})



	return obj
})