define([
	'backbone',
	'app/models/Player',
	'text!/templates/EditPlayers.html'
], function(B, Player, template){
	"use strict";
	return Backbone.View.extend({
		tagName: 'form',
		model: null,
		events: {
			"click .submit": 'handleSubmit',
			"click .cancel": 'handleReset',
			'click .avatar': 'handleAvatar'
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

			this.submit = this.$el.find('.actions .submit');
			this.cancel = this.$el.find('.actions .cancel');
			return this;
		},
		_mergeData: function(){
			var that = this;
			this.$el.find('input').each(function(i,item){
				item.value = item.value.replace(/\s/ig,"")
				that.model.set(item.name, item.value)
				item.className = item.checkValidity() ? 'valid' : 'invalid'
			});	
		},
		handleSubmit:function(e){
			e.preventDefault();
			if (!this.model){
				this.model = new Player();
			};
			this._mergeData();
			if (this.model.isValid()){
				Backbone.trigger(_g.events.FORM_SUBMIT, this.model);
			}
		},

		handleReset:function(e){
			e.preventDefault();
			this.$el.find('input').removeClass('invalid')
			this.el.reset()
			this._mergeData();
		},
		handleAvatar: function(e){
			e.preventDefault()
			trace('-- avatar replace')
		}
	})
})