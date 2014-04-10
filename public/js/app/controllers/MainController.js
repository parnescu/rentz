define([
	'backbone'
	,'app/utils/Global'
	,'app/views/lists/List'
	,'app/views/pages/Page'
	,'app/views/pages/GameOver'
	,'app/views/forms/EditPlayers'
	,'app/views/lists/GameTypeList'
	,'app/views/lists/GameDetailList'
	,'app/views/lists/ScoringList'
	,'app/controllers/GameController'
], function(B, _g, List, Page, GameOver, EditPlayers, GameTypeList, GameDetailList, ScoreList, GameController){
	"use strict";
	if (!window.__mc){
		var f = function(){
			var _currView,stage, game, wasInited = false,
			// base screen actions
				_resetCurrent = function(){
					if(_currView){
						_currView.remove();
						_currView = null;
					}
					_.each(_g.pageStack, function(page, i){
						if (page === null){
							_g.pageStack.splice(i,1);
						}
					});
				},
				_resetEditMode = function(){
					_currView.head.setButtonState('back', "off");
					_currView.content.removeClass("editable");
				},
				_resetViews = function(){
					_.each(_g.pageStack, function(view){ 
						if (view){
							view.remove();
							view = null;	
						}
					});
					_g.pageStack = [];
				},
				_goBack = function(){
					var _type = _currView.viewType;
					_resetCurrent();

					//_end();
					_currView = _g.pageStack.pop();

					
					if (_currView){
						_start(_currView);
						if (_currView.viewType === _g.viewType.PLAYERS_SELECT_SCREEN.type ||
							_type === _g.viewType.GAME_OUTCOME_SCREEN.type){
							if (_currView.menu){
								_currView.menu.find('a').removeClass('selected');	
							}
						}
					}
				},
				_startNewGame = function(){
					if (!GameController.currentGame()){
						GameController.remove();
						GameController.init();
						Backbone.trigger(_g.events.START_NEW_GAME);	
					}
					
					var model = _g.sPlayers.models[GameController.currentPlayer()];
					game = GameController.currentGame();

					Backbone.trigger(_g.events.BUILD_PAGE, {
							type: _g.viewType.START_NEW_GAME,
							menu: [
								_g.viewType.GAME_OUTCOME_SCREEN
								,_g.viewType.GAME_QUIT_SCREEN
							],
							header:{
								title: "Select game type"
							},
							view: new GameTypeList({
								collection: GameController.playerRounds(model)
								,model: model
							})
						}, true);

					model = null;
				},				
				_addPlayerScreen = function(model){
					_resetEditMode();
					trace("MAIN_CTRL:: -> "+(model ? "edit" : "new ")+" player screen");
					Backbone.trigger(_g.events.BUILD_PAGE, {
						type: _g.viewType.PLAYER_EDIT_SCREEN,
						header:{
							back: _g.viewType.GO_BACK,
							title: model ? model.fullname() : "New Player"
						}
						,view: new EditPlayers({ model: model})
					});
				},
				_addPlayersChooseScreen = function(){
					if(_g.players.length < _g.MIN_PLAYERS){
						throw new Error("There must be at least "+_g.MIN_PLAYERS+" players available to play");
					}

					Backbone.trigger(_g.events.BUILD_PAGE, {
						type: _g.viewType.PLAYERS_SELECT_SCREEN,
						header:{
							back: _g.viewType.BACK,
							next: _g.viewType.PLAYERS_SORT_SCREEN
						},
						view: new List({
							selectable: true,
							collection: _g.players
						})
					});
				},
				_addPlayersSelectScreen = function(){
					//	1. determine which players were selected
					//	2. build a new collection based on those players
					//	3. change list subview with sortable list if enough players are selected
					
					_g.sPlayers.reset();
					_g.players.each(function(item, i){ if (item.get('_select')){ item.set('_select', false);_g.sPlayers.add(item);}}, this);

					if (_g.sPlayers.length >= _g.MIN_PLAYERS && _g.sPlayers.length <= _g.MAX_PLAYERS){
						Backbone.trigger(_g.events.BUILD_PAGE, {
							type: _g.viewType.PLAYERS_SORT_SCREEN,
							header:{
								back: _g.viewType.GO_BACK,
								title: "Players Order",
								next: _g.viewType.START_NEW_GAME
							}
							,view: new List({ collection: _g.sPlayers, sortable:true})
						});
					}else{
						throw new Error('The allowed number of players is between '+_g.MIN_PLAYERS+' and '+_g.MAX_PLAYERS);
					}
				},
				_addGameDetailsScreen = function(game){
					game = game || GameController.currentGame();
					
					Backbone.trigger(_g.events.BUILD_PAGE, {
						type: _g.viewType.GAME_OUTCOME_SCREEN,
						header:{
							title: _g.util.format(new Date(game.get('name')))
							,back: _g.viewType.GO_BACK
						},
						// menu:[
						// 	_g.viewType.GAME_OUTCOME_SCREEN
						// 	,_g.viewType.GAME_QUIT_SCREEN
						// ],
						view: new GameDetailList({ model: game})
					});
				},
				_showPlayersPage = function(){
					_resetViews();
					_resetCurrent();
					Backbone.trigger(_g.events.BUILD_PAGE, {
						type: _g.viewType.PLAYERS_LIST_SCREEN,
						menu: [
							_g.viewType.GAMES_SCREEN,
							_g.viewType.PLAYERS_LIST_SCREEN
						],
						header: {
							title: "Players",
							next: _g.viewType.PLAYER_EDIT_SCREEN,
							back: _g.viewType.EDIT
						},
						view: new List({
							collection: _g.players,
							deletable: true
						})
					});
				},
				_showGamesPage = function(){
					_resetViews();
					_resetCurrent();
					Backbone.trigger(_g.events.BUILD_PAGE, {
						type: _g.viewType.GAMES_SCREEN,
						menu: [
							_g.viewType.GAMES_SCREEN,
							_g.viewType.PLAYERS_LIST_SCREEN
						],
						header: {
							title: "Games",
							next: _g.viewType.PLAYERS_SELECT_SCREEN,
							back: _g.viewType.EDIT
						},
						view: new List({
							collection: _g.games,
							deletable: true
						})
					});
				},
				_showRoundPage = function(){
					var round = GameController.currentRound(),
						isRentz = round.get('gameType').get('type') === _g.gameType.RENTZ.get('type'),
						isRedPriest = round.get('gameType').get('type') === _g.gameType.RED_PRIEST.get('type');

					Backbone.trigger(_g.events.BUILD_PAGE, {
						type: _g.viewType.ROUND_DATA_SCREEN,
						header:{
							back: _g.viewType.GO_BACK,
							next: _g.viewType.SAVE_ROUND,
							title: "Game: "+round.get('gameType').get('type')
						},
						view: new ScoreList({
							players: _g.sPlayers
							,collection: round.get('scores')
							,gameType: round.get('gameType')
							,type: isRentz || isRedPriest ? 'icon' : 'normal'
							,sortable:  isRentz ? true : false
						})
					});
					round = null;
				},
			// end - base screen actions

			_handleGameEnd = function(){
				trace("MAIN_CTRL:: add game to collection + show final results")
				_g.games.add(game);

				Backbone.trigger(_g.events.BUILD_PAGE, {
					type: _g.viewType.GAME_ENDED_SCREEN,
					header: {
						next: _g.viewType.GAMES_SCREEN,
						title: "Game Results"
					},
					view: new GameOver({ model: game})
				})
			},
			_handleFormSubmit = function(model){
				trace('MAIN_CTRL:: form was submitted from '+_currView.viewType);
				if (_currView.viewType === _g.viewType.PLAYER_EDIT_SCREEN.type){
					// handle players model add
					_g.players.add(model);
				}
				_goBack();
			},
			_handleBackButton = function(){
				trace('MAIN_CTRL:: back button was clicked -> '+_currView.viewType);

				if (_currView.head.data.back.type === _g.viewType.GO_BACK.type){
					_goBack();
				}else{
					// edit button enabled
					var button = _currView.head.back[0],
						pressed = button.dataset.pressed;
					pressed = pressed === undefined ? "on" : pressed === 'off' ? "on" : "off";
					_currView.head.setButtonState('back', pressed);

					if (pressed == 'on'){ _currView.content.addClass("editable");
					}else{ _currView.content.removeClass("editable");}
					trace(" -> "+pressed);

					pressed = null;
				}
			},
			_handleContinueButton = function(data){
				trace('MAIN_CTRL:: switch to new page ' + data.type)

				switch(data.type){
					case _g.viewType.PLAYER_EDIT_SCREEN.type:
						_addPlayerScreen();
						break;
					case _g.viewType.PLAYERS_SELECT_SCREEN.type:
						_addPlayersChooseScreen();
						break;
					case _g.viewType.PLAYERS_SORT_SCREEN.type:
						_addPlayersSelectScreen();
						break;
					case _g.viewType.START_NEW_GAME.type:
						_startNewGame();
						break;
					case _g.viewType.SAVE_ROUND.type:
						Backbone.trigger(_g.events.UPDATE_ROUND);
						break;
					case _g.viewType.GAMES_SCREEN.type:
						_resetCurrent();
						_showGamesPage();
						break;
					default:
						trace('------ SCREEN TYPE NOT HANDLED YET: '+_currView.viewType);
				 		trace(data);
						break;
				}
			},
			_handleListClicked = function(model){
				trace('MAIN_CTRL:: list item was clicked -> '+_currView.viewType);
				switch(_currView.viewType){
					case _g.viewType.PLAYERS_LIST_SCREEN.type:
						_addPlayerScreen(model);
						break;
					case _g.viewType.GAMES_SCREEN.type:
						trace('MAIN_CTRL:: switch to new page "view game details"');
						_addGameDetailsScreen(model)
						break;
					default:
						trace('------ SCREEN TYPE NOT HANDLED YET: '+_currView.viewType);
						break;
				}
			},
			_handleNavClicked = function(type){
				if (type === _g.viewType.GAME_QUIT_SCREEN.type){
					trace("MAIN_CTR:: QUIT current game");
					_resetViews()
					if (_currView){
						_currView.remove();
						_currView = null;
					}
				};

				if (_currView){
					var title, view;

					trace('MAIN_CTRL:: navigation item was clicked -> '+type);
					switch(type){
						case _g.viewType.PLAYERS_LIST_SCREEN.type:
							_resetCurrent();
							_showPlayersPage();
							break;
						case _g.viewType.GAMES_SCREEN.type:
							_resetCurrent();
							_showGamesPage();
							break;
						case _g.viewType.PLAYER_EDIT_SCREEN.type:
							_addPlayerScreen();
							break;
						case _g.viewType.GAME_OUTCOME_SCREEN.type:
							_addGameDetailsScreen();
							break;
						default:
							trace('------ SCREEN TYPE NOT HANDLED YET: '+type);
							break;
					}
				}
			},
			_handleBuildPage = function(data, clear){
				trace('MAIN_CTRL:: build new page ' + data.type.type);

				if (clear){
					trace(' ---> remove all pages from stack');
					_resetViews();
					_currView.remove();
				}else{
					_g.pageStack.push(_currView);
				}

				//_end();
				_currView = null;
				_currView = new Page(data).render();
				stage.appendChild(_currView.el);
				//_start(_currView);
			},
			_start = function(view){				
				if (wasInited) return;
				if (view){
					//_end(view);
					_currView = view;
					wasInited = true;
					trace('\nMAIN_CTRL:: init');
					if (!stage){
						stage = document.querySelector('#rentz');
					}
					Backbone.on(_g.events.HEAD_CLICK_BACK, _handleBackButton);
					Backbone.on(_g.events.HEAD_CLICK_CONTINUE, _handleContinueButton);
					Backbone.on(_g.events.NAV_CLICKED, _handleNavClicked);
					Backbone.on(_g.events.LIST_CLICK, _handleListClicked);
					Backbone.on(_g.events.BUILD_PAGE, _handleBuildPage);
					Backbone.on(_g.events.FORM_SUBMIT, _handleFormSubmit);
					Backbone.on(_g.events.GAME_ENDED, _handleGameEnd);
					Backbone.on(_g.events.SIGNAL_ROUND_INIT, _showRoundPage);
				}else{
					throw new Error('Specify a view to init on');
				}
			},
			_end = function(){
				trace('MAIN_CTRL:: reset');
				Backbone.off(_g.events.HEAD_CLICK_BACK, _handleBackButton);
				Backbone.off(_g.events.HEAD_CLICK_CONTINUE, _handleContinueButton);
				Backbone.off(_g.events.NAV_CLICKED, _handleNavClicked);
				Backbone.off(_g.events.LIST_CLICK, _handleListClicked);
				Backbone.off(_g.events.BUILD_PAGE, _handleBuildPage);
				Backbone.off(_g.events.FORM_SUBMIT, _handleFormSubmit);
				Backbone.off(_g.events.GAME_ENDED, _handleGameEnd);
				Backbone.off(_g.events.SIGNAL_ROUND_INIT, _showRoundPage);
				if (_currView){
					_currView.remove();
					_currView = null;
				}
				wasInited = false;
			}

			return {
				init: _start,
				remove: _end,
				view: function(){ return _currView;},
				purge: _resetCurrent
			}
		}
		window.__mc = new f();;
	}
	return window.__mc
})