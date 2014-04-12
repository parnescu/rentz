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


			//window.addEventListener('error', function(e){ alert(e.error.message); e.preventDefault(); });



			// T.B.D
			var bogusPlayers = [
				{ name:"Gigi", surname:"Kent", nick:'shigy'}
				,{ name:"Lebby", surname:"Coarse", nick:'mutaflex'}
				,{ name:"Olga", surname:"Cracinova", nick:'suky', picture:'data:image/png;base64,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'}
			]
			view.menu.find('a:eq(1)').click();
			view = MainController.view();
			view.head.$el.find('a:eq(1)').click();
			var i,m = MainController.view();			
			i = 2;
			m.$el.find('input[name=nick]').val(bogusPlayers[i].nick);
			m.$el.find('input[name=name]').val(bogusPlayers[i].name);
			m.$el.find('input[name=surname]').val(bogusPlayers[i].surname);

			m.subview.submit.click();

			i--;
			view.head.$el.find('a:eq(1)').click();
			m = MainController.view();			
			m.$el.find('input[name=nick]').val(bogusPlayers[i].nick);
			m.$el.find('input[name=name]').val(bogusPlayers[i].name);
			m.$el.find('input[name=surname]').val(bogusPlayers[i].surname);
			m.subview.submit.click();

			i--;
			view.head.$el.find('a:eq(1)').click();
			m = MainController.view();			
			m.$el.find('input[name=nick]').val(bogusPlayers[i].nick);
			m.$el.find('input[name=name]').val(bogusPlayers[i].name);
			m.$el.find('input[name=surname]').val(bogusPlayers[i].surname);
			m.subview.submit.click();
			
			m = null;

			view = MainController.view();	
			view.head.next.click();
			//view.menu.find('a:eq(0)').click();
			// view = MainController.view();
			// view.head.$el.find('a:eq(1)').click();
			// view = MainController.view();
			// view.subview.$el.find('a.action').click()
			// view.head.next.click();
			// view = MainController.view();
			// view.head.next.click();
			// - end T.B.D












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