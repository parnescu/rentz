
(function(){
	'use strict';
	window.trace = function(g){console.log(g);}
	require.config({
		paths: {
			'jasmine': '/jasmine/lib/jasmine-core/jasmine',
			'jasmine-html': '/jasmine/lib/jasmine-core/jasmine-html',
			'boot': '/jasmine/lib/jasmine-core/boot',
			'jquery': '/jquery/dist/jquery.min',
			'jqueryui': '/jquery-ui/jquery-1.10.2',
			'underscore': '/underscore/underscore',
			'backbone': '/backbone/backbone',
			'text': '/requirejs-text/text'
		}
		,shim:{
			'jasmine': {
				exports: 'jasmine'
			},
			'jasmine-html':{
				deps: ['jasmine'],
				exports: 'jasmine'
			},
			'boot':{
				deps: ['jasmine','jasmine-html'],
				exports: 'jasmine'
			},
			backbone:{
				deps: ['jquery','underscore','text','jqueryui'],
				exports: 'Backbone'
			},
			jquery: {
				exports: "$"
			}
		}
	});
	var specs = ['/js/tests/specfile.js'],
		dependencies = [
			'/js/app/utils/Global.js'
			,'/js/app/views/ListItem.js'
			,'/js/app/models/Player.js'
			,'/js/app/models/Game.js'
			,'/js/app/views/List.js'
		];

	specs = specs.concat(dependencies);
	requirejs(['boot','jquery'], function(){
		requirejs(specs, function(specs, _g, ListItem, Player, Game, List){
			window._g = _g;
			window.ListItem = ListItem;
			window.List = List;
			window.Player = Player;
			window.Game = Game;
			window.onload();
		});
	});
})()
