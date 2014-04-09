trace = function(g){console.log(g);}
require.config({
	paths: {
		'jquery': '/jquery/dist/jquery.min',
		'jqueryui': '/jqueryui/ui/jquery-ui',
		'underscore': '/underscore/underscore',
		'backbone': '/backbone/backbone',
		'text': '/requirejs-text/text'
	}
	,shim:{
		backbone:{
			deps: ['jquery','underscore','text'],
			exports: 'Backbone'
		},
		jquery: {
			exports: "$"
		},
		jqueryui:{
			deps: ['jquery']
		}
	}
});
require([
	'js/app/main.js'
],function(app){
	app.init();
});
