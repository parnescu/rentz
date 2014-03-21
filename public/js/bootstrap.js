trace = function(g){console.log(g);}
require.config({
	paths: {
		'jquery': '/jquery/dist/jquery.min',
		'underscore': '/underscore/underscore',
		'backbone': '/backbone/backbone',
		'jasmine': 'jasmine/lib/jasmine-core/jasmine'
	}
	,shim:{
		backbone:{
			deps: ['jquery','underscore'],
			exports: 'Backbone'
		},
		jquery: {
			exports: "$"
		}

	}
});
require(['backbone','js/app/main.js'],function(B){
	
});
