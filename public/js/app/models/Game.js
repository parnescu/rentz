define([
	'backbone',
	'app/models/GameRound'
], function(B, GameRound){
	var _c = Backbone.Collection.extend({ model: GameRound});
	return Backbone.Model.extend({
		defaults: {
			name: new Date().toString(),
			rounds: new _c(),
			players: [],
			_points: [],
			_index: -1
		},
		validate: function(attr){
			var i,j, tmp, points = [],  done = [];
			for(i=0;i<attr.rounds.length;i++){
				if (attr.rounds.models[i].get('available') === false){
					tmp = attr.rounds.models[i].get('_points')
					for(j=0;j<tmp.length;j++){
						points[j] = points[j] || 0;
						points[j] += tmp[j];
					}
					done.push(attr.rounds.models[i])
				}
			}
			this.set("_points", points);
			this.get('rounds').add(done);
			tmp = i = j = points = null;
		}
	});
})