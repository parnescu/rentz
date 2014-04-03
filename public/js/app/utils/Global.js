define([
	'app/models/GameType',
	'app/models/Player',
	'app/models/Game',
],function(GameType, Player, Game){
	"use strict";
	var max = 6, min = 3, c, obj, current;
	if (!window.__g){
		var _utils = {}
		_utils.plural = function(nr, str){
			if (str == "") return "";
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

		var _types = {
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
		},
		_events = {
			LIST_CLICK: "listItemClicked"
			,LIST_CHANGE_VALUE: "valueChanged"
			,LIST_MODIFY_VALUE: "valueChangedByUser"
			,HEAD_CLICK_BACK: "headerClickBack"
			,HEAD_CLICK_CONTINUE: "headerClickNext"
			,NAV_CLICKED: "footerClick"
			,BUILD_PAGE: "buildNewPage"
			,FORM_SUBMIT: "submitNewData"
		},
		_views = {
			PLAYERS_LIST_SCREEN: { title: "Players", type:"playersScreen"}
			,GAMES_SCREEN: { title: "Games", type:"gamesScreen"}
			
			,PLAYER_EDIT_SCREEN: { title: "New Player", type:"newPlayer"}
			,PLAYERS_SELECT_SCREEN: { title: "Choose players", type:"selectPlayers"}
			,PLAYERS_SORT_SCREEN: { title: "Continue", type:"sortPlayers"}

			,START_NEW_GAME: { title: 'Continue', type:"newGame"}

			,GAME_QUIT_SCREEN: { title: "Quit game", type:"quitScreen"}
			,GO_BACK: { title: "Back", type:"goBack"}
			,EDIT: { title: "Edit", type:"edit"}
		};

		obj = {
			MIN_PLAYERS: min
			,MAX_PLAYERS: max
			,events: _events
			,util: _utils
			,gameType: _types
			,viewType: _views
			
			,players: null 			// all players collection
			,games: null 			// all the saved games collection
			,sPlayers: null 		// selected players for the game
			,pageStack: []			// used for back button
		}
		obj.__defineSetter__('currentPlayers', function(val){ current = val;});
		obj.__defineGetter__('currentPlayers', function(){ return current;});

		c = Backbone.Collection.extend({ model: Player});
		obj.players = new c();
		obj.sPlayers = new c();

		c = Backbone.Collection.extend({ model: Game});
		obj.games = new c();
		c = null;
		window.__g = obj
	}

	return window.__g;
})