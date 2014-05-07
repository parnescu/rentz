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
		userMode: false,
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
		initialize: function(data){
			this.userMode = data ? data.userMode || false : false;
		},
		render: function(){
			var data = this.model ? this.model.toJSON() : {};
			data.userMode = this.userMode;
			this.$el.html(this.template(data));

			this.submit = this.$el.find('.actions .submit');
			this.cancel = this.$el.find('.actions .cancel');

			this.imgProcessor = this.$el.find('input[type=file]')
			this.imgProcessor.on('change', function(e){ 
				Backbone.trigger(_g.events.AVATAR_FROM_PHONECAM, e.target.files[0]);
			});

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
				var evt = this.userMode ? _g.events.USER_SUBMIT : _g.events.FORM_SUBMIT
				// if you're editing the logged user... change event to save details
				if(this.model === _g.currentUser){evt = _g.events.FORM_SUBMIT;}

				// if you're creating a new player for user, add user's id
				if (_g.currentUser){ this.model.set('userId', _g.currentUser.id);}

				Backbone.trigger(evt, this.model);
			}else{
				Backbone.trigger(_g.events.SHOW_ERROR, _g.errors.PLAYER_DATA_FAIL);
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