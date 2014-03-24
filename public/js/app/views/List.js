define(['backbone'], function(B){
	var view = Backbone.View.extend({
		tagName: 'ul',
		className: 'list',		
		initialize: function(){

		},
		render: function(){

			return this;
		}
	});

	return view;
})