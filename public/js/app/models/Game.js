define(['backbone'], function(){
	return Backbone.Model.extend({
		defaults: {
			name: new Date().toString(),
			players: [],
			rounds: [],
			count: 0
		}
	})
})