define([
	'backbone'
	,'app/utils/Global'
	,'app/views/lists/List'
	,'app/views/pages/Page'
	,'app/views/forms/EditPlayers'
	,'app/views/lists/GameTypeList'
	,'app/controllers/GameController'
], function(B, _g, List, Page, EditPlayers, GameTypeList, GameController){
	"use strict";
	if (!window.__mc){
		var f = function(){
			var _currView,stage,
			// base screen actions
				_resetEditMode = function(){
					_currView.head.setButtonState('back', "off");
					_currView.content.removeClass("editable");
				},
				_resetViews = function(){
					_.each(_g.pageStack, function(view){ 
						view.remove();
						view = null;
					});
					_g.pageStack = [];
				},
				_goBack = function(){
					var _type = _currView.viewType;
					_currView.remove();
					_currView = null;

					_end();
					_currView = _g.pageStack.pop();
					
					if (_currView){
						_start(_currView);
						if (_currView.viewType === _g.viewType.PLAYERS_SELECT_SCREEN.type ||
							_type === _g.viewType.GAME_OUTCOME_SCREEN.type){
							_currView.menu.find('a').removeClass('selected');
						}
					}
				},
				_startNewGame = function(){
					GameController.remove();
					GameController.init();
					Backbone.trigger(_g.events.START_NEW_GAME);
					
					var model = _g.sPlayers.models[GameController.currentPlayer()];
					Backbone.trigger(_g.events.BUILD_PAGE, {
							type: _g.viewType.START_NEW_GAME.type,
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
				},				
				_addPlayerScreen = function(model){
					_resetEditMode();
					trace("MAIN_CTRL:: -> "+(model ? "edit" : "new ")+" player screen");
					Backbone.trigger(_g.events.BUILD_PAGE, {
						type: _g.viewType.PLAYER_EDIT_SCREEN.type,
						header:{
							back: _g.viewType.GO_BACK,
							title: model ? model.fullname() : "New Player"
						}
						,view: new EditPlayers({ model: model})
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
							type: _g.viewType.PLAYERS_SORT_SCREEN.type,
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
				_addGameDetailsScreen = function(){
					Backbone.trigger(_g.events.BUILD_PAGE, {
						type: _g.viewType.GAME_OUTCOME_SCREEN.type,
						header:{
							title: _g.util.format(new Date(GameController.currentGame().get('name')))
							,back: _g.viewType.GO_BACK
						},
						menu:[
							_g.viewType.GAME_OUTCOME_SCREEN
							,_g.viewType.GAME_QUIT_SCREEN
						],
						view: null
					});
				},
			// end - base screen actions

			_handleFormSubmit = function(model){
				trace('MAIN_CTRL:: form was submitted from '+_currView.viewType);
				if (_currView.viewType === _g.viewType.PLAYER_EDIT_SCREEN.type){
					// handle players model add
					_g.players.add(model);
				}
				_goBack();
			},
			_handleBackButton = function(button){
				trace('MAIN_CTRL:: back button was clicked -> '+_currView.viewType);

				if (_currView.head.data.back.type === _g.viewType.GO_BACK.type){
					_goBack();
				}else{
					// edit button enabled
					var pressed = button.dataset.pressed;
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
					case _g.viewType.PLAYERS_SORT_SCREEN.type:
						_addPlayersSelectScreen();
						break;
					case _g.viewType.START_NEW_GAME.type:
						_startNewGame();
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
						trace('MAIN_CTRL:: switch to new page "view game details"')
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
							title = _g.viewType.PLAYERS_LIST_SCREEN.title;
							view = new List({
								deletable: true,
								collection: _g.players
							}).render();
							break;
						case _g.viewType.GAMES_SCREEN.type:
							title = _g.viewType.GAMES_SCREEN.title;
							view = new List({
								deletable: true,
								collection: _g.games
							}).render();
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

					if (view){
						if (_currView.subview){ _currView.subview.remove();}

						_currView.viewType = type;
						_currView.subview = view;
						
						_currView.head.setButtonState('back', "off");
						_currView.head.title.text(title);

						_currView.content.remove("editable");
						_currView.content.append(view.el);

						title = null;
					}
				}
			},
			_handleBuildPage = function(data, clear){
				trace('MAIN_CTRL:: build new page ' + data.type);

				if (clear){
					trace(' ---> remove all pages from stack');
					_resetViews();
					_currView.remove();
				}else{
					_g.pageStack.push(_currView);
				}

				_end();
				_currView = null;
				_currView = new Page(data).render();
				stage.append(_currView.el);
				_start(_currView);
			},
			_start = function(view){
				if (view){
					//trace('MAIN_CTRL:: init');
					_end(view);
					_currView = view;
					Backbone.on(_g.events.HEAD_CLICK_BACK, _handleBackButton);
					Backbone.on(_g.events.HEAD_CLICK_CONTINUE, _handleContinueButton);
					Backbone.on(_g.events.NAV_CLICKED, _handleNavClicked);
					Backbone.on(_g.events.LIST_CLICK, _handleListClicked);
					Backbone.on(_g.events.BUILD_PAGE, _handleBuildPage);
					Backbone.on(_g.events.FORM_SUBMIT, _handleFormSubmit);
				}else{
					throw new Error('Specify a view to init on');
				}
			},
			_end = function(){
				//trace('MAIN_CTRL:: reset');
				_currView = null;
				Backbone.off(_g.events.HEAD_CLICK_BACK, _handleBackButton);
				Backbone.off(_g.events.HEAD_CLICK_CONTINUE, _handleContinueButton);
				Backbone.off(_g.events.NAV_CLICKED, _handleNavClicked);
				Backbone.off(_g.events.LIST_CLICK, _handleListClicked);
				Backbone.off(_g.events.BUILD_PAGE, _handleBuildPage);
				Backbone.off(_g.events.FORM_SUBMIT, _handleFormSubmit);
			}
			stage = $('#stage');

			return {
				init: _start,
				remove: _end,
				view: function(){ return _currView;}
			}
		}

		window.__mc = new f();;
	}
	return window.__mc
})