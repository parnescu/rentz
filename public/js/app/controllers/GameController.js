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
			_getGamesForPlayer = function(model){
				// return all the rounds for playerId == model.fullname()
				var _c = Backbone.Collection.extend({ model: Round }),
					collection = new _c(), id = model.cid;//fullname();

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
				
				
				Backbone.trigger(_g.events.BUILD_PAGE, {
					type: _g.viewType.ROUND_DATA_SCREEN,
					header:{
						back: _g.viewType.GO_BACK,
						next: _g.viewType.SAVE_ROUND,
						title: "Game: "+round.get('gameType').get('type')
					},
					view: new ScoreList({
						players: _g.sPlayers
						,collection: _currRound.get('scores')
						,gameType: _currRound.get('gameType')
					})
				});
			},
			_handleStartNewGame = function(){
				trace('GAME_CTRL:: start new game')
			 	if (_g.sPlayers.length > _g.MAX_PLAYERS || _g.sPlayers.length < _g.MIN_PLAYERS){
			 		throw new Error('The allowed number of players is between '+_g.MIN_PLAYERS+' and '+_g.MAX_PLAYERS);
			 		return;
			 	};
			 	_g.currentPlayers = _g.sPlayers.length;
			 	var type, round, scores, ii, i, players = [],
			 		_s = Backbone.Collection.extend({ model: Score });

			 	_.each(_g.sPlayers.models, function(item){ players.push(item.cid);});
			 	_currGame = new Game({ players: players });

			 	// populate game with data
				_.each(_g.sPlayers.models, function(model, index){
			 	 	for(ii in _g.gameType){
			 	 		scores = new _s();
			 	 		type = _g.gameType[ii]

			 	 		round = new Round({
			 	 			playerId: model.cid,
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
			 	players = round = _s = null;
			},
			_handleUpdateRound = function(){
				if (!_currRound) return;

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

					if (i >= _currGame.get('rounds').length){
						trace('SIGNAL THE END');
						return;
					}
				}

				// var v = _g.pageStack.pop()
				// if (v){
				// 	v.remove();
				// 	v = null;
				// }
				Backbone.trigger(_g.events.SET_NEXT_PLAYER);

				trace('--- continue')
				//Backbone.trigger(_g.events.HEAD_CLICK_CONTINUE, _g.viewType.START_NEW_GAME);
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
				
				currentGame: function(){ return _currGame;},
				currentPlayer: function(){ return _currPlayer;},
				currentRound: function(){ return _currRound;}
			}
		};
		window.__gc = new f();
	}
	return window.__gc;
});