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
		}

	}
});
require([
	'backbone',
	'js/app/main.js',
	'jqueryui'
],function(B){
});
