define([
	'backbone'
	,'app/utils/Global'
	,'text!/templates/Login.html'
], function(B, _g, tmp){
	return Backbone.View.extend({
		template: _.template(tmp),
		events:{
			"click .submit": "handleClick"
		},
		initialize: function(){	
			_.bindAll(this, 'handleInputChange');
		},
		render: function(){
			var data = this.model ? this.model.toJSON() : {}
			this.$el.html(this.template(data));
			this.$el.find('input').on('keyup', this.handleInputChange);

			this.form = this.$el.find('form')[0];
			this.submit = this.$el.find('button.submit');
			this.userName = this.$el.find('input[type=text]');
			this.userPass = this.$el.find('input[type=password]');

			if(!this.form.checkValidity()){
				this.submit.attr('disabled', 'disabled');
			}
			data = null;
			return this;
		},
		handleClick: function(e){
			e.preventDefault();
			Backbone.trigger(_g.events.USER_LOGIN, this);
		},
		handleInputChange: function(e){
			if(this.userName.val().length > 2 && this.userPass.val().length > 2){
				this.submit.removeAttr('disabled');
			}else{
				this.submit.attr('disabled', 'disabled');
			}
			e.preventDefault();
		}
	})
})