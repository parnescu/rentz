define([
	'backbone'
	,'app/utils/Global'
], function(B, _g, tmp){
	return Backbone.View.extend({
		initialize: function(){
		},
		render: function(){
			var filtered = this.collection.filter(_g.filter.finishedRounds),
				i,j, points, total = [];

			for (i = 0;i<filtered.length;i++){
				points = filtered[i].get('_points');
				for (j=0;j<points.length;j++){
					total[j] = total[j] || 0;
					total[j] += points[j];
				}
			}
			trace(total);
			filtered = points = i = j = null;
			
			_g.sPlayers.each(function(player,i){
				trace(player.fullname()+" has "+total[i]+"points");
			});
			return this;
		}
	});
});