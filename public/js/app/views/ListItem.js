define([
	'backbone',
	'text!../../../templates/ListElement.html'
], function(B, template){
	return Backbone.View.extend({
		tagName: 'li',
		template: _.template(template),
		data: {
			selectable: false,
			sortable: false,
			deletable: false,
			values: {
				name: 'default element'
			}
		},
		initialize: function(data){
			for (var ii in data){
				this.data[ii] = data[ii]
			}

		},
		render: function(){
			this.$el.html(this.template(this.data))
			return this;
		}
	});
})