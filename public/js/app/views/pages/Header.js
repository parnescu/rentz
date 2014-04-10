define([
	'backbone'
	,"app/utils/Global"
	,'text!/templates/Header.html'
],function(B, _g, template){
	return Backbone.View.extend({
		tagName: "header",
		template: _.template(template),
		data: null,
		events: {
			'click a': "handleClick"
		},
		attributes:{
			"data-role": "header"
			,"position": "fixed"
		},
		initialize: function(data){
			this.data = data;
			this.data.title = this.data.title || ""
		},
		render: function(){
			this.$el.html(this.template(this.data));
			
			this.title = this.$el.find('h1');
			this.back = this.$el.find('a.back');
			this.next = this.$el.find('a.next');

			return this;
		},
		handleClick: function(e){
			var evt = $(e.target).hasClass('next') ? _g.events.HEAD_CLICK_CONTINUE : _g.events.HEAD_CLICK_BACK;
				data = $(e.target).hasClass('next') ? this.data.next : this.data.back;
			Backbone.trigger(evt, data);
			e.preventDefault();
		},
		setButtonState: function(type, state, label){
			var but = this.$el.find('a.'+type+'');
			if (but.size()){
				label = label ? label : state==='on' ? 'Done' : 'Edit'
				but.text(label);
				but[0].dataset.pressed = state;	
			}
			but = null;
		}
	})
})