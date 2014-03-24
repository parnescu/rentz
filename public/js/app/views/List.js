define([
	'backbone',
	'app/views/ListItem',
	'app/models/Player'
], function(B, ListItem, Player){
	var view = Backbone.View.extend({
		tagName: 'ul',
		className: 'list',
		collection: null,
		initialize: function(data){
			if (data){
				this.collection = data.collection || null;
				delete data.collection;
				Object.keys(data).forEach(function(key){ this.data[key] = data[key];}, this);			
				
				if (this.collection){ this.collection.on('add', this.renderItem, this);}
			}
		},
		render: function(){
			if (this.collection){
				this.collection.each(this.renderItem, this);
			}
			return this;
		},
		renderItem: function(item){
			var _view = new ListItem(this.merge({
				model: item,
				type: item.get('surname') ? 'player' : 'game'
			})).render();
			
			this.el.appendChild(_view.el);
			_view = null;
		},
		merge: function(obj){
			for (var ii in this.data){
				obj[ii] = this.data[ii];
			}
			return obj;
		}
	});

	return view;
})