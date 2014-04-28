define([
	'app/models/GameType',
	'app/models/Player',
	'app/models/Game',
],function(GameType, Player, Game){
	"use strict";
	var max = 6, min = 3, c, obj, current, cam;
	if (!window.__g){
		var _utils = {}
		_utils.months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		_utils.plural = function(nr, str){
			if (str == "") return "";
			return str + (Number(nr) === 1 ? "" : "s")
		}
		_utils.merge = function(data, obj){
			for (var ii in obj){
				data[ii] = obj[ii];
			}
		}
		_utils.format = function(date, style){
			var str = "";
			style = style || "dd MM yyyy";
			switch(style){
				case "dd MM yyyy":
					str += date.getDate()+" "+_utils.months[date.getMonth()]+" "+date.getFullYear();
					break;
			}
			return str;
		}
		_utils.progressive = function(nr){
			var sum = 1;
			for (var i=2;i<=nr;i++) { sum += i; }
			return sum;
		}
		_utils.playerRoundByType = function(player, type, collection){
			var i,model;
			for (var i=0;i<collection.models.length;i++){
				model = collection.models[i];
				if (model.get('playerId') === player && model.get('gameType').get('type')  === type){
					return model;
				}
			}
		}
		_utils.updateRound = function(game, model){
			// used for TDD tests
			var i = Number(game.get('_index'));
			i++;

			model.isValid();
			model.set("_index",i);
			game.set('_index',i);
			game.isValid();
		}
		_utils.camera = function(){
			if (!cam){

				var video = document.querySelector('video.screen'),
						back = document.querySelector('.cancelAvatar'),
						button = document.querySelector('.newAvatar'),
						next = document.querySelector('.saveAvatar'),

						avatar = document.querySelector('a.avatar'),
						canvas = document.querySelector('.canvas'),
						stream = null,
						state = 1;

				$(button).show();
				$(back).show();
				$(avatar).hide();

				navigator.getMedia = ( navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.getUserMedia );
				navigator.getMedia({
						video: true,
						audio: false
					},
					function(_stream) {
						stream = _stream;
						
						if (navigator.mozGetUserMedia) {
							video.mozSrcObject = stream;
						} else {
							var vendorURL = window.URL || window.webkitURL;
							video.src = vendorURL.createObjectURL(stream);
						}
					}
					,function(err) {
						trace("Unable to get video stream!");
					}
				);

				$(button).click(function(e){
					e.preventDefault();
					state = 2;

					canvas.width = video.videoWidth;
					canvas.height = video.videoHeight;
					var ctx = canvas.getContext('2d');
					ctx.drawImage(video,0,0,canvas.width,canvas.height);
					
					avatar.children[0].src = canvas.toDataURL();

					$(button).hide();
					$(next).show();
				});
				$(back).click(function(e){
					e.preventDefault();
					if (state === 2){
						canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
						canvas.width = canvas.height = 0;
						state = 1;

						$(button).show();
						$(next).hide();
					}else{
						state = 0;
						stream.stop();

						$(button).hide();
						$(back).hide();
						$(avatar).show();
					}
				});
				$(next).click(function(e){
					e.preventDefault();
					// save it to the model

					state = 0;
					stream.stop();
					
					$(back).hide();
					$(next).hide();
					$(avatar).show();
				});
			}
			return cam;
		}

		obj = {
			MIN_PLAYERS: min
			,MAX_PLAYERS: max
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
			,LIST_ITEM_DELETED: "listItemDeleted"
			,AVATAR_CHOOSE: "getAvatar"
			,HEAD_CLICK_BACK: "headerClickBack"
			,HEAD_CLICK_CONTINUE: "headerClickNext"
			,NAV_CLICKED: "footerClick"
			,BUILD_PAGE: "buildNewPage"
			,FORM_SUBMIT: "submitNewData"
			,USER_SUBMIT: "submitUserData"
			,USER_LOGIN: "sendLoginData"

			,START_NEW_GAME: "initNewGame"
			,CHOOSE_GAME_TYPE: "typeSelected"
			,SIGNAL_ROUND_INIT: "buildRound"
			,UPDATE_ROUND: "updateRound"
			,GAME_ENDED: "gameDone"
		},
		_views = {
			PLAYERS_LIST_SCREEN: { title: "Players", type:"playersScreen"}		
			,PLAYERS_SELECT_SCREEN: { title: "Choose players", type:"selectPlayers"}
			,PLAYERS_SORT_SCREEN: { title: "Continue", type:"sortPlayers"}
			,PLAYER_EDIT_SCREEN: { title: "New Player", type:"newPlayer"}

			,GAMES_SCREEN: { title: "Games", type:"gamesScreen"}
			,GAME_QUIT_SCREEN: { title: "Quit game", type:"quitScreen"}
			,GAME_OUTCOME_SCREEN: { title: 'Game details', type:"gameOutcome"}
			,GAME_ENDED_SCREEN: { title: 'Game finished', type:"completeGame"}
			
			,START_NEW_GAME: { title: 'Continue', type:"newGame"}
			,ROUND_DATA_SCREEN: { title: 'Input round outcome', type:"completeRound"}
			,GO_BACK: { title: "Back", type:"goBack"}
			,EDIT: { title: "Edit", type:"edit"}
			,SAVE: { title: "Save", type: "save"}
			,SAVE_ROUND: { title: "Save", type:"saveRound"}
			,INITIAL_SCREEN: { title: "Rentz", type:"initialScreen"}
			,ACCOUNT_SCREEN: { title: "Account", type:"accountScreen"}
			,ACCOUNT_ADD: { title: "Register", type:"addUser"}
			,ACCOUNT_REMOVE: { title: "Logout", type: "removeUser"}
		},
		_err = {
			ROUND_DATA_NOT_GIVEN: "There are still points not given"
			,ONE_INSTANCE_ONLY: "Only one instance of the game should be inited" 
			,MIN_PLAYERS_NEEDED: "There must be at least "+obj.MIN_PLAYERS+" players available to play"
			,PLAYERS_NEEDED: "The allowed number of players is between "+obj.MIN_PLAYERS+" and "+obj.MAX_PLAYERS
			,NO_CAMERA: "No camera available!"
			,EDIT_NONE: "No items to edit!"
			,PLAYER_DATA_FAIL: "No proper information was given about the player!"
			,PLAYER_SAVE_FAIL: "Could not save your player, try again later!"
			,CAMERA_CONTROLLER_FAIL: "Main controller is missing from initialization"
			,CAMERA_STREAM_FAIL: "Unable to get video stream, your browser might not support it!"
			,USER_NOT_LOGGED: "Unable to log in using these credentials!"
		},
		_camType = {
			WEB: "online"
			,MOBILE: "mobile"
			,NONE: "nocam"
		}

		obj.events =  _events
		obj.util = _utils
		obj.gameType = _types
		obj.viewType = _views
		obj.errors =_err
		obj.cameraType = _camType
		obj.mainCtrl = null			// reference to MainController
		obj.gameCtrl = null			// reference to GameController
		obj.players = null 			// all players collection
		obj.games = null 			// all the saved games collection
		obj.sPlayers = null 		// selected players for the game
		obj.pageStack = []			// used for back button
		obj.devmode = false 		// --- dev switch
		obj.currentUser = null 		// the user that is currently logged in
		
		obj.defaultMenu = [ _views.GAMES_SCREEN, _views.PLAYERS_LIST_SCREEN, _views.ACCOUNT_SCREEN]
		obj.__defineSetter__('currentPlayers', function(val){ current = val;});
		obj.__defineGetter__('currentPlayers', function(){ return current;});

		c = Backbone.Collection.extend({ model: Player, url: "/api/players"});
		obj.players = new c();
		obj.sPlayers = new c();
		c = null;

		c = Backbone.Collection.extend({ model: Game});
		obj.games = new c();
		c = null;

		window.__g = obj
	}

	return window.__g;
})