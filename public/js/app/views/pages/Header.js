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
		initialize: function(data){
			this.data = data;
		},
		render: function(){
			this.$el.html(this.template(this.data));
			this.title = this.$el.find('h1');
			return this;
		},
		handleClick: function(e){
			Backbone.trigger($(e.target).hasClass('next') ? _g.events.HEAD_CLICK_CONTINUE : _g.events.HEAD_CLICK_BACK, e.target);
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