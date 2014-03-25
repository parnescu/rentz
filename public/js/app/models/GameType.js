define(['backbone'],function(B){
	return Backbone.Model.extend({
		defaults: {
			type: 'noType',
			icon: 'string',
			multiplier: 0,
			maxItems: 0
		}
	});
})