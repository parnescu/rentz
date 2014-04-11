trace = function(g){console.log(g);}
require.config({
	baseUrl: "/js",
	paths: {
		'jquery': '/jquery/dist/jquery.min',
		'jqueryui': '/jqueryui/ui/jquery-ui',
		'jquerymobile': '/jqm/jquery.mobile-1.4.2.min',
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
	,'jquery'
	,"jqueryui"
],function(app, jqm, tf){
	if($ && $.mobile){
		$.mobile.linkBindingEnabled = false;
		$.mobile.hashListeningEnabled = false;	
	}
	
	require(["jqueryui-touch-punch/jquery.ui.touch-punch.js"], function(){
		app.init();	
	})
	
});