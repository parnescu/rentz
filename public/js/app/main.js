trace = function(r){ 
	console.log(r);
	if(window.___xcg){
		window.___xcg.innerHTML += "<br/>"+(typeof(r) === 'string' ? r : JSON.stringify(r));
	}
}
define([
	'app/utils/Global'
	,'app/utils/Memory'
	,'app/views/pages/Page'
	,'app/controllers/MainController'
	,'app/controllers/GameController'
], function(_g, Memory, Page, MainController, GameController){
	"use strict";
	var notification, f = function(){
		function _start(element){
			// define in app console
			window.___xcg = document.createElement('p');
			window.___xcg.className = "logger";
			document.body.appendChild(window.___xcg);
			// ---- end console



			trace("APP:: init called");
			if (document.querySelector('#rentz')){
				throw new Error('Only one instance of the game should be inited');
				return;
			}

			if (!element){
				trace("APP:: no element given - build html node");
				element = document.createElement('div');
				element.id = "rentz";
				document.body.appendChild(element);
			}else{
				element.id = "rentz";
			}

			var stage = $('#rentz'),
				view = new Page({
					type: _g.viewType.INITIAL_SCREEN,
					menu: _g.defaultMenu,
					header: {
						title: "xtests"
					}
				}).render();

			stage.append(view.el)

			Memory.init();
			MainController.init(view);
			view.$el.addClass('ui-page-active');

			
			// get data from server only if app is "logged in", that means 
			// localstorage has currentUser defined in it with nick, pass, userId & login
			if (Memory.getUser().nick && Memory.getUser().pass){
				trace('MAIN:: trigger automatic logging in..')
				Backbone.trigger(_g.events.USER_LOGIN, Memory.getUser());
			}

			window.addEventListener('error', function(e){ 
				e.preventDefault();
				trace("MAIN:: --- page error kicked in");
				Backbone.trigger(_g.events.SHOW_ERROR, { code: -2, reason: e.error ? e.error.message : e.message});
			});
			view = null;
		}

		function _end(){
			_.each(_g.pageStack, function(view){ view.remove(); view = null; });

			MainController.view().remove();
			MainController.remove();
			GameController.remove();

			trace("APP:: destroy");
		}
		return {
			init: _start
			,destroy: _end
		}
	}
	return new f();
});