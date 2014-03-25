define(['backbone'],function(B){
	return Backbone.Model.extend({
		defaults: {
			multiplier: 1,
			value: 10,
			maxItems: 1
		}
	});
})