define([
	'backbone'
	,'app/utils/Global'
	,'text!/templates/GameOver.html'
], function(B, _g, tmp){
	return Backbone.View.extend({
		tagName: 'article',
		template: _.template(tmp),
		initialize: function(){

		},
		render: function(){
			var _w = _g.sPlayers.get(this.model.get('_winner').id),
				players = [], i,
				data = {
					winner: _w.fullname()
					,winnerPic: _w.get('picture')
					,winnerPoints: this.model.get('_winner').score
					,name: _g.util.format(new Date(this.model.get('name')))
					,items: this.model.get('players').length
				};

			this.$el.html(this.template(data));
			this.list = this.$el.find('.playersList');

			for(i=0;i<this.model.get('players').length;i++){
				players[i] = {
					id: this.model.get('players')[i],
					score: this.model.get('_points')[i]
				}
			}
			players = players.sort(function(a,b){ return a.score < b.score});

			_.each(players, function(player, i){
			 	_w = _g.sPlayers.get(player.id);
			 	this.list.append("<li><span class='name'>"+_w.fullname()+"</span><span class='points'>"+player.score+"</span></li>")
			}, this);

			_w = data = i = players = null;
			return this;
		}
	});
})