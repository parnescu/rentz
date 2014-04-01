
(function(){
	'use strict';
	window.trace = function(g){console.log(g);}
	require.config({
		baseUrl: '../js',
		paths: {
			'jasmine': '/jasmine/lib/jasmine-core/jasmine',
			'jasmine-html': '/jasmine/lib/jasmine-core/jasmine-html',
			'boot': '/jasmine/lib/jasmine-core/boot',
			'jquery': '/jquery/dist/jquery.min',
			'jqueryui': '/jqueryui/ui/jquery-ui',
			'jqueryuifix': '/jqueryui-touch-punch/jquery.ui.touch-punch',
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
				deps: ['jquery','underscore','text','jqueryui','jqueryuifix'],
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
			,'/js/app/models/Player.js'
			,'/js/app/models/Game.js'
			,'/js/app/models/Scoring.js'
			,'/js/app/views/lists/ListItem.js'
			,'/js/app/views/lists/List.js'
			,'/js/app/views/lists/ScoringElement.js'
			,'/js/app/views/lists/ScoringList.js'
			,'/js/app/views/pages/Header.js'
			,'/js/app/views/pages/Page.js'
			,'/js/app/views/forms/EditPlayers.js'
		];

	specs = specs.concat(dependencies);
	requirejs(['boot','jquery'], function(){
		requirejs(specs, function(specs, 
			_g,
			Player,
			Game,
			Score,
			ListItem,
			List,
			ScoreElement,
			ScoreList,
			Header,
			Page,
			EditPlayers
		){
			// models
			window.Player = Player;
			window.Game = Game;
			window.Score = Score;
			// views
			window.ListItem = ListItem;
			window.List = List;
			window.ScoreElement = ScoreElement;
			window.ScoreList = ScoreList;
			window.Header = Header;
			window.Page = Page;
			window.EditPlayers = EditPlayers;
			// boot
			window._g = _g;
			window.onload();
		});
	});
})()
