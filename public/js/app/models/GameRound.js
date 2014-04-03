define(['backbone'], function(B){
	return Backbone.Model.extend({
		defaults: {
			playerId: null,
			available: true,
			gameType: null,
			scores: null
		}
	});
});