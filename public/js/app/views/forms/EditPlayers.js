define([
	'backbone',
	'app/models/Player',
	'text!/templates/EditPlayers.html'
], function(B, Player, template){
	return Backbone.View.extend({
		tagName: 'form',
		model: null,
		events: {
			"click .submit": 'handleSubmit',
			"click .cancel": 'handleReset'
		},
		attributes:{
			name: "editForm",
			id: "playerEditForm",
			method: "post",
			action: "#"
		},
		template: _.template(template),
		initialize: function(){

		},
		render: function(){
			var data = this.model ? this.model.toJSON() : {};
			this.$el.html(this.template(data));
			this.$el.find('input').on('change', this.handleDataInput);
			if (this.model){
				this.model.on('change', this.handleModelChange, this);
			}
			this.submit = this.$el.find('.actions .submit');
			this.cancel = this.$el.find('.actions .cancel');
			return this;
		},
		handleSubmit:function(e){
			e.preventDefault();
			if (this.model === null){
					this.model = new Player();
					this.model.on('change', this.handleModelChange, this);
				};

				
			if (this.el.checkValidity()){
				var that = this;
				
				this.$el.find('input').each(function(i,item){
					if (!item.disabled){
						that.model.set(item.name, item.value)
					}
				});	
			}
		},
		handleReset:function(e){
			e.preventDefault();
			this.el.reset()
		},
		handleModelChange: function(model){
			//trace('model changed ' + JSON.stringify(model.changed));
		},
		handleDataInput: function(){
			trace('data changed');
		}
	})
})