define([
	'backbone'
	,'app/utils/Global'
	,'app/models/Game'
	,'app/models/GameRound'
	,'app/models/Scoring'
], function(B, _g, Game, Round, Score){
	"use strict"
	if (!window.__gc){
		var f = function(){
			var _currGame, _currPlayer, _currRound,
				_r = Backbone.Collection.extend({ model: Round}),
				_s = Backbone.Collection.extend({ model: Score}),

			_parseGameData = function(gameData){
				var rounds = new _r(), _round, scores;

				_.each(gameData.get('rounds'), function(round){
					scores = new _s();
					_.each(round.scores, function(score){scores.add(new Score(score));});
					
					_round = new Round(round);
					_round.set('gameType', _g.util.getTypeByName(round.gameType, _g.gameType))
					_round.set('scores', scores);
					rounds.add(_round);
				});
				gameData.set('rounds', rounds);
				return gameData;
			},
			_getGamesForPlayer = function(model){
				// return all the rounds for playerId == model.fullname()
				var collection = new _r(),
					id = _g.devmode ? model.cid : model.id

				_currGame.get('rounds').each(function(round, index){
					if (round.get('playerId') === id){
						collection.add(round);
					}
				}, this);
				return collection;
			},
			_handleNextPlayer = function(){
				if (_currPlayer === null || _currPlayer === undefined){
					_currPlayer = 0;
				}else{
					_currPlayer = _currPlayer + 1 < _currGame.get('players').length ? _currPlayer + 1 : 0;
				}
			},
			_handleChooseRound = function(round){
				trace('GAME_CTRL:: choose round "' +round.get('gameType').get('type')+'" for player '+round.get('playerId'))
				_currRound = round;
				Backbone.trigger(_g.events.SIGNAL_ROUND_INIT)
			},
			_handleStartNewGame = function(){
				trace('GAME_CTRL:: start new game')
			 	if (_g.sPlayers.length > _g.MAX_PLAYERS || _g.sPlayers.length < _g.MIN_PLAYERS){
			 		Backbone.trigger(_g.events.SHOW_ERROR, 'The allowed number of players is between '+_g.MIN_PLAYERS+' and '+_g.MAX_PLAYERS);
			 		return;
			 	};
			 	_g.currentPlayers = _g.sPlayers.length;
			 	var type, round, scores, ii, i, players = [];

			 	_.each(_g.sPlayers.models, function(item){ players.push(_g.devmode ? item.cid : item.id);});
			 	_currGame = new Game({ players: players });
			 	_currGame.set('playerId', _g.currentUser ? _g.currentUser.id : '-1');
			 	_currGame.set('_playerWon', _g.currentUser ? _g.currentUser.get('won') : 0);

			 	// populate game with data
				_.each(_g.sPlayers.models, function(model, index){
			 	 	for(ii in _g.gameType){
			 	 		scores = new _s();
			 	 		type = _g.gameType[ii]

			 	 		round = new Round({
			 	 			playerId: _g.devmode ? model.cid : model.id,
			 	 			gameType: type,
			 	 			scores: scores
			 	 		});

			 	 		for (i=0;i<players.length;i++){
			 	 			scores.add(new Score({
			 	 				maxItems: type.get('maxItems'),
			 	 				multiplier: type.get('multiplier'),
			 	 			}));
			 	 		}
			 	 		_currGame.get('rounds').add(round);
			 	 	}
			 	});
				Backbone.trigger(_g.events.SET_NEXT_PLAYER);

			 	type = round = scores = ii = i = null;
			 	players = round = null;
			},
			_handleUpdateRound = function(){
				if (!_currRound) return;

				// check to see if data was actually inputed
				// all scores values are 0 -> needs input
				var sum = _currRound.get('scores').toJSON().reduce(function(sum, item){ sum+= item.value; return sum;},0);
				if (sum === 0 || sum < _currRound.get('scores').models[0].get('maxItems')){
					Backbone.trigger(_g.events.SHOW_ERROR, _g.errors.ROUND_DATA_NOT_GIVEN);
					return;
				}
				sum = null;
				trace("GAME_CTRL:: round data ")

				if (_currRound.get('_index')){
					_currRound.isValid();
					_currGame.isValid();
				}else{
					var i = _currGame.get('_index');
					i++;
					
					_currRound.isValid();
					_currRound.set('_index', i);
					_currGame.set('_index', i);
					_currGame.isValid();
				}
	
				// update models scores
				// get next player
				// go back to choose game type with next player
				//trace(_currGame.get('_points'));
				_.each(_g.sPlayers.models, function(player, i){ player.set('_score', _currGame.get('_points')[i])}, this);
				Backbone.trigger(_g.events.SET_NEXT_PLAYER);			

				var page = _g.pageStack.pop();
				page.subview.model = _g.sPlayers.models[_currPlayer]
				page.subview.collection = _getGamesForPlayer(page.subview.model)
				page.subview.render();
				_g.pageStack.push(page);

				Backbone.trigger(_g.events.HEAD_CLICK_BACK, _g.viewType.START_NEW_GAME);

				if (i >= _currGame.get('rounds').length-1){
					trace('GAME_CTRL: signal game ended');
					Backbone.trigger(_g.events.GAME_ENDED, _currGame);
					return;
				}
				page = null;
			},
			_subscribe = function(){
				Backbone.on(_g.events.START_NEW_GAME, _handleStartNewGame);
				Backbone.on(_g.events.SET_NEXT_PLAYER, _handleNextPlayer);
				Backbone.on(_g.events.CHOOSE_GAME_TYPE, _handleChooseRound);
				Backbone.on(_g.events.UPDATE_ROUND, _handleUpdateRound);
				_g.gameCtrl = this;
			},
			_unsubscribe = function(){
				Backbone.off(_g.events.START_NEW_GAME, _handleStartNewGame);
				Backbone.off(_g.events.SET_NEXT_PLAYER, _handleNextPlayer);
				Backbone.off(_g.events.CHOOSE_GAME_TYPE, _handleChooseRound);
				Backbone.off(_g.events.UPDATE_ROUND, _handleUpdateRound);
				_currGame = null;
				_currPlayer = null;
				_currRound = null;
				_g.gameCtrl = null;
			}
			return {
				init: _subscribe,
				remove: _unsubscribe,
				playerRounds: _getGamesForPlayer,
				parseGame: _parseGameData,
				
				currentGame: function(){ return _currGame;},
				currentPlayer: function(){ return _currPlayer;},
				currentRound: function(){ return _currRound;}
			}
		};
		window.__gc = new f();
	}
	return window.__gc;
});