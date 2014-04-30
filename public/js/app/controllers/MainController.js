define([
	'backbone'
	,'app/utils/Global'
	,'app/utils/Memory'
	,'app/models/Player'
	,'app/views/lists/List'
	,'app/views/pages/Page'
	,'app/views/pages/GameOver'
	,'app/views/forms/EditPlayers'
	,'app/views/forms/Login'
	,'app/views/forms/Alert'
	,'app/views/lists/GameTypeList'
	,'app/views/lists/GameDetailList'
	,'app/views/lists/ScoringList'
	,'app/controllers/GameController'
	,'app/controllers/CameraController'
	,'app/controllers/Router'
], function(B, _g, Memory, Player, List, Page, GameOver, EditPlayers, Login, Alert, GameTypeList, GameDetailList, ScoreList, GameController, CameraController, Router){
	"use strict";
	if (!window.__mc){
		var f = function(){
			var _currView,stage, game, wasInited = false, _route, allow = true, isView,
			// base screen actions
				_triggerDevError = function(e){
					if (_g.devmode){
						throw new Error(e);
					}
				},
				_showError = function(errData){
					if (typeof(errData) === 'string'){
						errData = {
							code: -1,
							reason: errData
						}
					}

					errData.code = errData.code || -1;
					if (_g.notification){
						_g.notification.remove();
						_g.notification = null;
					}
					_g.notification = new Alert().render(errData);
					stage.appendChild(_g.notification.el);
				},
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
					_resetCurrent();
					_currView = _g.pageStack.pop();
					CameraController.stopCamera();

					if (_currView){
						var _type = _currView.viewType;
						_start(_currView);
						if (_currView.viewType === _g.viewType.PLAYERS_SELECT_SCREEN.type ||
							_type === _g.viewType.GAME_OUTCOME_SCREEN.type){
							if (_currView.menu){
								_currView.menu.find('a').removeClass('selected');	
							}
						}
						_type = null;
					}
					allow = true;
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
				_addPlayerScreen = function(model, isUser){
					isUser = isUser || false;

					if (!_g.devmode && !_g.currentUser && !isUser){
						Backbone.trigger(_g.events.SHOW_ERROR, _g.errors.USER_CREATE_DENY)
						return;
					}

					_resetEditMode();
					trace("MAIN_CTRL:: -> "+(model ? "edit" : "new ")+" player screen");
					Backbone.trigger(_g.events.BUILD_PAGE, {
						type: _g.viewType.PLAYER_EDIT_SCREEN,
						header:{
							next: _g.viewType.SAVE,
							back: _g.viewType.GO_BACK,
							title: model ? model.fullname() : "New Player"
						}
						,view: new EditPlayers({ model: model, userMode: isUser})
					});
				},
				_addPlayersChooseScreen = function(){
					if(_g.players.length < _g.MIN_PLAYERS){
						Backbone.trigger(_g.events.SHOW_ERROR, _g.errors.MIN_PLAYERS_NEEDED);
						return;
					}

					Backbone.trigger(_g.events.BUILD_PAGE, {
						type: _g.viewType.PLAYERS_SELECT_SCREEN,
						header:{
							back: _g.viewType.GO_BACK,
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
						_triggerDevError(_g.errors.PLAYERS_NEEDED)
						Backbone.trigger(_g.events.SHOW_ERROR, _g.errors.PLAYERS_NEEDED);
						return;
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
						menu: _g.defaultMenu,
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
						menu: _g.defaultMenu,
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
				_showInitialPage = function(){
					Backbone.trigger(_g.events.BUILD_PAGE, {
						type: _g.viewType.INITIAL_SCREEN,
						menu: [
							_g.viewType.GAMES_SCREEN,
							_g.viewType.PLAYERS_LIST_SCREEN
						],
						header: {
							title: "Rentz"
						}
					});
				},
				_showAccountPage = function(){
					Backbone.trigger(_g.events.BUILD_PAGE, {
						type: _g.viewType.ACCOUNT_SCREEN,
						menu: _g.defaultMenu,
						header: {
							back: _g.currentUser ? _g.viewType.ACCOUNT_REMOVE : undefined
							,title: "User Account"
							,next: _g.currentUser ? _g.viewType.SAVE : _g.viewType.ACCOUNT_ADD
						},
						view: _g.currentUser ? new EditPlayers({ model:_g.currentUser, userMode: true}) : new Login()
					});
				},
				_logout = function(){
					trace("MAIN_CTRL:: logout user '"+_g.currentUser.get('nick')+"'");

					_g.players.reset();
					_g.games.reset();
					_g.currentUser = null;

					_resetViews();
					_currView.remove();
					_currView = null;
					
					_showAccountPage();
				},
			// end - base screen actions
			_handleItemDeletion = function(view){
				if (view.model){
					// if deleted player is yourself, log-out
					if (_g.currentUser && view.model.id === _g.currentUser.id){ _logout();}

					var c;
					if (c = view.model.collection){
						view.model.collection.remove(view.model)	
						view.model.destroy();
						view.remove();
						view = null;
						if (c.length === 0){
							_resetEditMode();
						}
						c = null;
					}
					
					if(view && view.model){
						view.model.destroy();
					}
				}
			},
			_handleAvatarReplacement = function(){
				CameraController.getCamera();
			},
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
				switch(_currView.viewType){
					case _g.viewType.PLAYER_EDIT_SCREEN.type:
						if (_g.devmode === true){
							_g.players.add(model);
							_goBack();
						}else{
							
							model.save(null,{
								wait:true,
								success: function(newModel, modelData){
									trace('MAIN_CTRL:: - player saved with id: '+modelData._id);	
									_g.players.add(newModel);
									_goBack();
								},
								error: function(e){
									_g.players.add(e);
									Backbone.trigger(_g.events.SHOW_ERROR, _g.errors.PLAYER_SAVE_FAIL);
								}
							});	
						}
						break;
					case _g.viewType.ACCOUNT_SCREEN.type:
						model.save();
						Backbone.trigger(_g.events.SHOW_ERROR, "Details saved");
						break;
					default:
						break;
				}
			},
			_handleUserLogin = function(view){
				// login
				// get players and games
				// set _g.currentUser
				var usr, pass;
				isView = (view instanceof Backbone.View);

				if (isView){
					usr = view.userName.val()
					pass = view.userPass.val()
				}else{
					usr = view.nick || null;
					pass = view.pass || null;
				}

				if (allow && usr && pass){
					trace("MAIN_CTRL:: send login to server");
					allow = false;
					$.ajax({
						url: '/api/user',
						method: 'GET',
						dataType: 'json',
						data: { nick: usr, pass: pass},
						success: _handleUserLoginSuccess,
						error: function(e){
							allow = true;
							Memory.removeUser();
							if (isView){
								Backbone.trigger(_g.events.SHOW_ERROR, _g.errors.USER_NOT_LOGGED);
							}
						}
					})
				}
			},
			_handleUserLoginSuccess = function(data){
				_g.currentUser = new Player(data);
				_g.players.fetch();
				allow = true;

				trace("MAIN_CTRL:: ..logged in!");
				Memory.saveUser({
					nick: data.nick,
					pass: data.password,
					id: data._id
				});

				if (isView){
					_currView.remove();
					_showAccountPage(_g.currentUser, true)
				}
			},
			_handleUserSubmit = function(model){
				if(allow){
					trace('MAIN_CTRL:: register was submitted');
					allow = false;
					model.save(null,{
						wait: true,
						success: function(newModel, modelData){
							allow = true;
							_goBack();
							trace('MAIN_CTRL::  register...done');
						},
						error: function(e){
							allow = true;
							Backbone.trigger(_g.events.SHOW_ERROR, _g.errors.PLAYER_SAVE_FAIL);
						}
					})
				}else{
					trace('MAIN_CTRL:: --- wait for server to callback');
				}
			},
			_handleBackButton = function(){
				trace('MAIN_CTRL:: back button was clicked -> '+_currView.viewType);

				if (_currView.head.data.back.type === _g.viewType.GO_BACK.type){
					_goBack();
				}else{
					switch(_currView.viewType){
						case _g.viewType.ACCOUNT_SCREEN.type:
							_logout()
							break;
						default:
							if (_currView.subview && _currView.subview.collection.length < 1){
								Backbone.trigger(_g.events.SHOW_ERROR, _g.errors.EDIT_NONE);
								return;
							}
							// edit button enabled
							var button = _currView.head.back[0],
								pressed = button.dataset.pressed;
							pressed = pressed === undefined ? "on" : pressed === 'off' ? "on" : "off";
							_currView.head.setButtonState('back', pressed);

							if (pressed == 'on'){ _currView.content.addClass("editable");
							}else{ _currView.content.removeClass("editable");}
							trace(" -> "+pressed);

							pressed = null;
							break;
					}
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
					case _g.viewType.SAVE.type:
						trace("MAIN_CTRL:: click submit button");
						_currView.subview.submit.click();
						break;
					case _g.viewType.ACCOUNT_ADD.type:
						_addPlayerScreen(null, true);
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
					_showInitialScreen();
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
						case _g.viewType.ACCOUNT_SCREEN.type:
							_showAccountPage();
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

				_currView = null;
				_currView = new Page(data).render();
				stage.appendChild(_currView.el);
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

					CameraController.init(this);

					//_route = new Router();
					//Backbone.history.start({pushState: true})

					Backbone.on(_g.events.HEAD_CLICK_BACK, _handleBackButton);
					Backbone.on(_g.events.HEAD_CLICK_CONTINUE, _handleContinueButton);
					Backbone.on(_g.events.NAV_CLICKED, _handleNavClicked);
					Backbone.on(_g.events.LIST_CLICK, _handleListClicked);
					Backbone.on(_g.events.BUILD_PAGE, _handleBuildPage);
					Backbone.on(_g.events.FORM_SUBMIT, _handleFormSubmit);
					Backbone.on(_g.events.USER_SUBMIT, _handleUserSubmit);
					Backbone.on(_g.events.USER_LOGIN, _handleUserLogin);

					Backbone.on(_g.events.GAME_ENDED, _handleGameEnd);
					Backbone.on(_g.events.SIGNAL_ROUND_INIT, _showRoundPage);
					Backbone.on(_g.events.LIST_ITEM_DELETED, _handleItemDeletion);
					Backbone.on(_g.events.AVATAR_CHOOSE, _handleAvatarReplacement);
					Backbone.on(_g.events.SHOW_ERROR, _showError);
				}else{
					_triggerDevError('Specify a view to init on');
					Backbone.trigger(_g.events.SHOW_ERROR, 'Specify a view to init on');
				}
			},
			_end = function(){
				trace('MAIN_CTRL:: reset');
				Backbone.off(_g.events.HEAD_CLICK_BACK);
				Backbone.off(_g.events.HEAD_CLICK_CONTINUE);
				Backbone.off(_g.events.NAV_CLICKED);
				Backbone.off(_g.events.LIST_CLICK);
				Backbone.off(_g.events.BUILD_PAGE);
				Backbone.off(_g.events.FORM_SUBMIT);
				Backbone.off(_g.events.USER_LOGIN);
				Backbone.off(_g.events.USER_SUBMIT);

				Backbone.off(_g.events.GAME_ENDED);
				Backbone.off(_g.events.SIGNAL_ROUND_INIT);
				Backbone.off(_g.events.LIST_ITEM_DELETED);
				Backbone.off(_g.events.AVATAR_CHOOSE);
				Backbone.off(_g.events.SHOW_ERROR);

				if (_currView){
					_currView.remove();
					_currView = null;
				}

				if(_g.notification){
					_g.notification.remove();
					_g.notification = null;
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