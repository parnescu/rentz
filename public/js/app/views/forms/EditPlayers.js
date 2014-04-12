define([
	'backbone',
	'app/utils/Global',
	'app/models/Player',
	'text!/templates/EditPlayers.html'
], function(B, _g, Player, template){
	"use strict";
	return Backbone.View.extend({
		tagName: 'form',
		model: null,
		events: {
			"click .submit": 'handleSubmit',
			"click .cancel": 'handleReset',
			'click .avatar': 'handleAvatar',
			'click .snapButton': 'handleTakePicture'
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
			var that = this, avt;
			this.$el.find('input').each(function(i,item){
				item.value = item.value.replace(/\s/ig,"")
				that.model.set(item.name, item.value)
				item.className = item.checkValidity() ? 'valid' : 'invalid'
			});

			avt = $('.avatar img').attr('src')
			if (avt != ""){
				this.model.set("picture", avt);
			}
			that = null;
		},
		handleSubmit:function(e){
			e.preventDefault();
			if (!this.model){
				this.model = new Player();
			};
			this.el.checkValidity();
			this._mergeData();

			if (this.model.isValid()){
				Backbone.trigger(_g.events.FORM_SUBMIT, this.model);
			}else{
				//throw new Error(_g.errors.PLAYER_DATA_FAIL);
			}
		},

		handleReset:function(e){
			e.preventDefault();
			this.$el.find('input').removeClass('invalid');
			this.el.reset();
			if(this.model){
				this._mergeData();	
			}
		},
		handleAvatar: function(e){
			e.preventDefault();
			Backbone.trigger(_g.events.AVATAR_CHOOSE, this);
		},
		handleTakePicture: function(e){
			e.preventDefault();
		}
	})
})