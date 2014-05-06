define([
	'backbone',
	'app/models/GameRound'
], function(B, GameRound){
	var _c = Backbone.Collection.extend({ model: GameRound});
	return Backbone.Model.extend({
		idAttribute: "_id",
		defaults: {
			name: new Date().toString(),
			rounds: new _c(),
			players: [],
			_points: [],
			_winner: {},
			_index: -1
		},
		url: function(){ return "/api/games/"+(this.get('_id')||""); },
		validate: function(attr){
			var i,j, tmp, points = [],  done = [], max = 0, maxIndex = 0;
			for(i=0;i<attr.rounds.length;i++){
				if (attr.rounds.models && attr.rounds.models[i].get('available') === false){
					tmp = attr.rounds.models[i].get('_points')
					for(j=0;j<tmp.length;j++){
						points[j] = points[j] || 0;
						points[j] += tmp[j];
					}
					done.push(attr.rounds.models[i])
				}
			}
			max = points.reduce(function(_max, curr, index){
				if (curr > _max){ _max = curr; maxIndex = index}
				return _max;
			},Number.NEGATIVE_INFINITY);
			
			this.set("_winner", {
				id: this.get('players')[maxIndex],
				score: max
			});

			this.set("_points", points);
			if (this.get('rounds') instanceof Backbone.Model){
				this.get('rounds').add(done);
			}
			i = j = tmp = points = done = max = maxIndex = null;
		}
	});
})