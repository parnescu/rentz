define([
	'backbone'
	,'text!../../../templates/PlayerListElement.html'
	,'text!../../../templates/GameListElement.html'
], function(B, playerTemplate, gameTemplate){
	return Backbone.View.extend({
		tagName: 'li',
		data: {
			selectable: false,
			sortable: false,
			deletable: false,
			type: 'player'
		},
		initialize: function(data){
			if (data){
				Object.keys(data).forEach(function(key){ this.data[key] = data[key];}, this)
				this.model = data.model || null;
				if (this.model){
					this.model.on('change', this.render, this);
				}
			}
		},
		render: function(){
			if (this.model){
				this.data.values = this.model.toJSON();				
			}
			this.$el.html(_.template(this.data.type != 'player' ? gameTemplate : playerTemplate)(this.data));
			return this;
		}
	});
})