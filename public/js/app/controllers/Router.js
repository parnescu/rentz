define([
	"backbone",
	"app/utils/Global"
], function(B, _g){
	return Backbone.Router.extend({
		routes: {
			"/": "default",
			"/playersScreen": "viewRoute"
		},
		default: function(){
			trace('default reached');
		},
		viewRoute: function(){
			trace('route triggered');
		}
	});
})