define([
	'backbone'
	,'app/utils/Global'
	,'app/models/Game'
	,'app/models/GameRound'
	,'app/models/Scoring'
], function(B, _g, Game, Round, Score){
	"use strict"
	var f = function(){
		var _currGame, _currPlayer,
		
		_handleNextPlayer = function(){
			if (_currPlayer === null || _currPlayer === undefined){
				_currPlayer = 0;
			}else{
				_currPlayer = _currPlayer + 1 < _currGame.get('players').length ? _currPlayer + 1 : 0;
			}
		},
		_handleStartNewGame = function(){
		 	if (_g.sPlayers.length > _g.MAX_PLAYERS || _g.sPlayers.length < _g.MIN_PLAYERS){
		 		throw new Error('The allowed number of players is between '+_g.MIN_PLAYERS+' and '+_g.MAX_PLAYERS);
		 		return;
		 	};

		 	var type, round, scores, ii, i, players = [],
		 		_c = Backbone.Collection.extend({ model: Round }),
		 		_s = Backbone.Collection.extend({ model: Score }),
		 		collection = new _c();

		 	_.each(_g.sPlayers.models, function(item){ players.push(item.cid);});
		 	_currGame = new Game({
		 		rounds: collection,
		 		players: players
		 	});

		 	// populate game with data
			_.each(_g.sPlayers.models, function(model, index){
		 	 	for(ii in _g.gameType){
		 	 		scores = new _s();
		 	 		type = _g.gameType[ii]

		 	 		round = new Round({
		 	 			playerId: model.fullname(),
		 	 			gameType: type,
		 	 			scores: scores
		 	 		});

		 	 		for (i=0;i<players.length;i++){
		 	 			scores.add(new Score({
		 	 				maxItems: type.get('maxItems'),
		 	 				multiplier: type.get('multiplier'),
		 	 			}));
		 	 		}
		 	 		collection.add(round);
		 	 	}
		 	});

			Backbone.trigger(_g.events.SET_NEXT_PLAYER);

		 	type = round = scores = ii = i = null;
		 	players = round = collection = _c = _s = null;
		},
		_subscribe = function(){
			Backbone.on(_g.events.START_NEW_GAME, _handleStartNewGame);
			Backbone.on(_g.events.SET_NEXT_PLAYER, _handleNextPlayer);
		},
		_unsubscribe = function(){
			Backbone.off(_g.events.START_NEW_GAME, _handleStartNewGame);
			Backbone.off(_g.events.SET_NEXT_PLAYER, _handleNextPlayer);
			_currGame = null;
			_currPlayer = null;
		}
		return {
			init: _subscribe,
			remove: _unsubscribe,
			game: _currGame,
			currentPlayer: function(){ return _currPlayer}
		}
	};
	return new f();
});