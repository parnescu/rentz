define([
	'backbone'
	,'text!/templates/ScoringElement.html'
], function(B, template){
	return Backbone.View.extend({
		tagName: 'li',
		template: _.template(template),
		initialize: function(data){
			this.data = data;
			this.data.type = this.data.type || "normal";
		},
		render: function(){
			if (this.model){
				var obj = this.model.toJSON();
				obj.type = this.data.type;

				this.$el.html(this.template(obj));
				this.model.on('change:value', this.handleModelChange, this);
				this.item = this.$el.find('input.points')[0];
				obj = null;	
			}
			return this;
		},
		handleModelChange: function(model){
			this.item.value = model.get('multiplier')*model.get('value')+" points";
		}
	})
})