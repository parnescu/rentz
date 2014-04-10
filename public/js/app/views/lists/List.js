define([
	'backbone',
	'app/utils/Global',
	'app/views/lists/ListItem',
	'app/models/Player'
], function(B, _g, ListItem, Player){
	return Backbone.View.extend({
		tagName: 'ul',
		className: 'list',
		collection: null,
		initialize: function(data){
			this.data = {};
			if (data){
				this.collection = data.collection || null;
				delete data.collection;

				_g.util.merge(this.data, data)
				if (this.collection){ this.collection.on('add', this.renderItem, this);}
			}
			_.bindAll(this,"handleSorting");
		},
		render: function(){
			if (this.data.minItems){
				var _l = this.data.minItemsLabel || ""
				this.data.counter = {
					label: _l,
					suffix: _l.split(" ").pop(),
					value: 0,
					max: this.data.minItems
				}

				this.$el.append('<li class="description"><label></label></li>');
				this.countRemaining();
				Backbone.on(_g.events.LIST_CLICK, this.handleItemSelection, this);
			}

			if (this.collection){
				this.collection.each(this.renderItem, this);
			}
			if(this.data.hasOwnProperty('deletable') && this.data.deletable === true){ 
				this.$el.addClass('withDelete');
			}
			if(this.data.hasOwnProperty('selectable') && this.data.selectable === true){
				this.$el.addClass('withSelect');
			}
			if(this.data.hasOwnProperty('sortable') && this.data.sortable === true){ 
				this.$el.addClass('withSort');
				var sortConfig = {
					cursor: 'move',
					update: this.handleSorting
				}
				this.$el.sortable(sortConfig);
			}
			return this;
		},
		renderItem: function(item, index){
			index = typeof(index) === 'number' ? index : this.collection.models.length-1
			var _view = new ListItem({
				model: item,
				type: item.get('surname') ? 'player' : 'game',
				selectable: this.data.selectable || false,
				deletable: this.data.deletable || false,
				sortable: this.data.sortable || false,
				index: index.toString()
			}).render();

			_view.counter = this.data.counter;
			this.$el.prepend(_view.el);
			
			_view = null;
		},
		countRemaining: function(){
			if (this.data.counter){
				var _itemsLeft = this.data.counter.max-this.data.counter.value;
				this.$el.find('li.description label').text(_itemsLeft+" "+_g.util.plural(_itemsLeft, this.data.counter.suffix))
			}
		},
		handleSorting: function(e){
			/*
				1. build temp collection
				2. reset current collection
				3. sort temp collection 
				4. re-add items to collection
			*/
			var _c = Backbone.Collection.extend({}),
				tmp = new _c();

			tmp.add(this.collection.models);
			this.collection.reset();

			_.each(this.$el.find('li'), function(el,index){
			 	this.collection.add(tmp.models[Number(el.dataset.pos)], {silent:true})
			}, this);

			tmp.reset()
			tmp = _c = null;
		},
		handleItemSelection: function(data){		
			var sum = 0;
			this.collection.each(function(item){ sum+= item.get('_select') === true;});
			this.data.counter.value = sum;
			this.countRemaining();
			sum = null;
		}
	});
})