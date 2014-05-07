define([
	'backbone'
	,'app/utils/Global'
	,'text!/templates/GameDetailList.html'
], function(B, _g, tmp){
	return Backbone.View.extend({
		tagName: 'table',
		template: _.template(tmp),
		render: function(){
			var i=0, data,
				items = this.model.get('rounds').filter(function(item){ 
					return item.get('available') === false;
				});

			items = items.sort(function(a,b){ return a.get('_index') > b.get('_index');});
			data = this.model.toJSON();
			data._items = items;
			data._players = _g.sPlayers.toJSON();


			// decide winner's place
			var temp = data._points.reduce(function(stack, curr, index){ 
				stack.push({ score: curr, index: index}); 
				return stack;
			}, [])
				.sort(function(a,b){ return a.score <= b.score })
				.reduce(function(_s, curr, index){ data._players[index]._place = _g.util.formatPlace(curr.index);},[]);
			temp = null;
			
			this.$el.html(this.template(data));
			this.$el.addClass('players_'+data._players.length);
			data = i = items = null;
			return this;
		}
	});
});