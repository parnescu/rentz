define(['backbone'], function(B){
	return Backbone.Model.extend({
		defaults: {
			playerId: null,
			available: true,
			gameType: null,
			scores: null,
			_points: []
		},
		validate: function(){
			var i =0, scores = this.get('scores'), arr = [];
			for (var i=0;i<scores.length;i++){
				arr.push(scores.models[i].getScore())
			}
			this.attributes._points = arr;
			this.set('available', false);
			arr = i = scores = null;
		}
	});
});