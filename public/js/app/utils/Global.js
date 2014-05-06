define([
	'app/models/GameType',
	'app/models/Player',
	'app/models/Game',
	'app/utils/Helper'
],function(GameType, Player, Game, Helper){
	"use strict";
	var max = 6, min = 3, c, obj, current, cam;
	if (!window.__g){
		obj = {
			MIN_PLAYERS: min
			,MAX_PLAYERS: max
		};

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
				maxItems: function(){ return Helper.progressive(current)}
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
			LIST_CLICK: 				"listItemClicked"
			,LIST_CHANGE_VALUE: 		"valueChanged"
			,LIST_MODIFY_VALUE: 		"valueChangedByUser"
			,LIST_ITEM_DELETED: 		"listItemDeleted"
			,AVATAR_CHOOSE: 			"getAvatar"
			,HEAD_CLICK_BACK: 			"headerClickBack"
			,HEAD_CLICK_CONTINUE: 		"headerClickNext"
			,NAV_CLICKED: 				"footerClick"
			,BUILD_PAGE: 				"buildNewPage"
			,FORM_SUBMIT: 				"submitNewData"
			,USER_SUBMIT: 				"submitUserData"
			,USER_LOGIN: 				"sendLoginData"
			,USER_GET_PLAYERS: 			"getPlayersData"

			,START_NEW_GAME: 			"initNewGame"
			,CHOOSE_GAME_TYPE: 			"typeSelected"
			,SIGNAL_ROUND_INIT: 		"buildRound"
			,UPDATE_ROUND: 				"updateRound"
			,GAME_ENDED: 				"gameDone"
			,SHOW_ERROR: 				"showErrMsg"
		},
		_views = {
			PLAYERS_LIST_SCREEN: 		{ title: "Players", type:"playersScreen"}		
			,PLAYERS_SELECT_SCREEN: 	{ title: "Choose players", type:"selectPlayers"}
			,PLAYERS_SORT_SCREEN: 		{ title: "Continue", type:"sortPlayers"}
			,PLAYER_EDIT_SCREEN: 		{ title: "New Player", type:"newPlayer"}

			,GAMES_SCREEN: 				{ title: "Games", type:"gamesScreen"}
			,GAME_QUIT_SCREEN: 			{ title: "Quit game", type:"quitScreen"}
			,GAME_OUTCOME_SCREEN: 		{ title: 'Game details', type:"gameOutcome"}
			,GAME_ENDED_SCREEN: 		{ title: 'Game finished', type:"completeGame"}
			
			,START_NEW_GAME: 			{ title: 'Continue', type:"newGame"}
			,ROUND_DATA_SCREEN: 		{ title: 'Input round outcome', type:"completeRound"}
			,GO_BACK: 					{ title: "Back", type:"goBack"}
			,EDIT: 						{ title: "Edit", type:"edit"}
			,SAVE: 						{ title: "Save", type: "save"}
			,SAVE_ROUND: 				{ title: "Save", type:"saveRound"}
			,INITIAL_SCREEN: 			{ title: "Rentz", type:"initialScreen"}
			,ACCOUNT_SCREEN: 			{ title: "Profile", type:"accountScreen"}
			,ACCOUNT_ADD: 				{ title: "Register", type:"addUser"}
			,ACCOUNT_REMOVE: 			{ title: "Logout", type: "removeUser"}
		},
		_err = {
			ROUND_DATA_NOT_GIVEN: 		{ reason: "There are still points not given"}
			,ONE_INSTANCE_ONLY: 		{ reason: "Only one instance of the game should be inited" }
			,MIN_PLAYERS_NEEDED: 		{ reason: "There must be at least "+obj.MIN_PLAYERS+" players available to play"}
			,PLAYERS_NEEDED: 			{ reason: "The allowed number of players is between "+obj.MIN_PLAYERS+" and "+obj.MAX_PLAYERS}
			,NO_CAMERA: 				{ reason: "No camera available!"}
			,EDIT_NONE: 				{ reason: "No items to edit!"}
			,PLAYER_DATA_FAIL: 			{ reason: "No proper information was given about the player!"}
			,PLAYER_SAVE_FAIL: 			{ reason: "Could not save your player, try again later!"}
			,CAMERA_CONTROLLER_FAIL: 	{ reason: "Main controller is missing from initialization"}
			,CAMERA_STREAM_FAIL: 		{ reason: "Unable to get video stream, your browser might not support it!"}
			,USER_NOT_LOGGED: 			{ reason: "Unable to log in using these credentials!" }
			,USER_CREATE_DENY: 			{ reason: "You can't add players if you don't have a profile defined!" }
		},
		_camType = {
			WEB: "online"
			,MOBILE: "mobile"
			,NONE: "nocam"
		};

		obj.events =  _events;
		obj.util = Helper;
		obj.gameType = _types;
		obj.viewType = _views;
		obj.errors =_err;
		obj.cameraType = _camType;

		obj.mainCtrl = null;		// reference to MainController
		obj.gameCtrl = null;		// reference to GameController
		obj.players = null;			// all players collection
		obj.games = null; 			// all the saved games collection
		obj.sPlayers = null; 		// selected players for the game
		obj.pageStack = [];			// used for back button
		obj.devmode = false; 		// --- dev switch

		obj.currentUser = null; 	// the user that is currently logged in
		obj.notification = null; 	// custom alert window


		obj.isMobile = (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))
		obj.isMobile = _.isNull(obj.isMobile) ? false : true;
		obj.isPhonegap = window.cordova ? true : false;

		trace("GLOBAL:: is mobile " +obj.isMobile);
		obj.defaultMenu = [ _views.GAMES_SCREEN, _views.PLAYERS_LIST_SCREEN, _views.ACCOUNT_SCREEN]
		obj.__defineSetter__('currentPlayers', function(val){ current = val;});
		obj.__defineGetter__('currentPlayers', function(){ return current;});

		c = Backbone.Collection.extend({ model: Player, url: function(){ return "/api/players/"+(obj.currentUser ? obj.currentUser.id : "");}});
		obj.players = new c();
		obj.sPlayers = new c();
		c = null;

		c = Backbone.Collection.extend({ model: Game, url: function(){ return "/api/games/"+(obj.currentUser ? obj.currentUser.id : "");}});
		obj.games = new c();
		c = null;

		window.__g = obj
	}

	return window.__g;
})