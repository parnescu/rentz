define([
	'backbone',
	'app/utils/Global',
	'app/views/lists/List',
	'app/views/pages/Page',
	'app/views/forms/EditPlayers'
], function(B, _g, List, Page, EditPlayers){
	"use strict";
	var f = function(){
		var _currView,stage,
		// base screen actions
			_resetEditMode = function(){
				_currView.head.setButtonState('back', "off");
				_currView.content.removeClass("editable");
			},
			_goBack = function(){
				_currView.remove();
				_currView = null;

				_end();
				_currView = _g.pageStack.pop();
				if (_currView){
					_start(_currView);	

					if (_currView.viewType === _g.viewType.PLAYERS_SELECT_SCREEN.type){
						_currView.menu.find('a').removeClass('selected');
					}
				}
			},
			_addPlayerScreen = function(model){
				_resetEditMode();
				trace("MAIN_CTRL:: -> "+(model ? "edit" : "new ")+" player screen");
				Backbone.trigger(_g.events.BUILD_PAGE, {
					type: _g.viewType.PLAYER_EDIT_SCREEN.type,
					header:{
						back: {
							title: "Back",
							type: ""
						},
						title: model ? model.fullname() : "New Player"
					}
					,view: new EditPlayers({ model: model})
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

			switch(_currView.viewType){
				case _g.viewType.PLAYER_EDIT_SCREEN.type:
					_goBack();
					break;
				default:
					var pressed = button.dataset.pressed;
					pressed = pressed === undefined ? "on" : pressed === 'off' ? "on" : "off";
					_currView.head.setButtonState('back', pressed);

					if (pressed == 'on'){ _currView.content.addClass("editable");
					}else{ _currView.content.removeClass("editable");}
					trace(" -> "+pressed);

					pressed = null;
					break;
			}
		},
		_handleContinueButton = function(){
			trace('MAIN_CTRL:: switch to new page ' + _currView.viewType)

			switch(_currView.viewType){
				case _g.viewType.PLAYERS_LIST_SCREEN.type:
					_addPlayerScreen();
					break;
				case _g.viewType.GAMES_SCREEN.type:
					trace(' -> "new game"')
					break;
				case _g.viewType.PLAYERS_SELECT_SCREEN.type:
					trace(' -> build players sort page')
					/*
						1. determine which players were selected
						2. build a new collection based on those players
						3. change list subview with sortable list
					*/
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
					case _g.viewType.GAME_QUIT_SCREEN.type:
						trace("MAIN_CTR:: quit current game");
						_goBack();
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
		_handleBuildPage = function(data){
			trace('MAIN_CTRL:: build new page ' + data.viewType);
			_g.pageStack.push(_currView);

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
	return new f();
})