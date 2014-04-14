trace = function(r){console.log(r);}
define([
	'app/utils/Global'
	,'app/views/pages/Page'
	,'app/controllers/MainController'
	,'app/controllers/GameController'
], function(_g, Page, MainController, GameController){
	"use strict";
	var f = function(){
		function _start(element){
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
					menu: [
						_g.viewType.GAMES_SCREEN,
						_g.viewType.PLAYERS_LIST_SCREEN
					],
					header: {
						title: "Rentz"
					}
				}).render();

			stage.append(view.el)
			MainController.init(view);
			view.$el.addClass('ui-page-active');


			window.addEventListener('error', function(e){ alert(e.error.message); e.preventDefault(); });
			view = stage = null;
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