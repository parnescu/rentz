define([
	'backbone'
	,'app/utils/Global'
	,'app/views/ScoringElement'
],function(B, _g, ScoringElement){
	return Backbone.View.extend({
		tagName: 'ul',
		className: 'scoreList list',
		elements: null,
		initialize: function(data){		
			_g.currentPlayers = data.players.length;

			this.data = data;
			delete this.data.collection;
			
			this._maxItems = this.data.gameType.get('maxItems');
			this._maxItems = typeof(this._maxItems) != 'number' ? this._maxItems() : this._maxItems
		
		},
		render: function(){
			this.elements = [];
			this.collection.each(this.renderOne,this);
			this.$el.append('<li class="description"><input disabled id="remaining"><label></label></li>');
			this.total = this.$el.find('li.description')[0];
					
			if (this.data.type && this.data.type != 'normal'){
				this.data.players.on('change', this.handleChangePlayer, this);	
			}else{
				this.collection.on('change', this.countRemaining, this);
			}
			this.countRemaining();
			return this;
		},
		renderOne: function(model, index){		
			var _view = new ScoringElement({
				model: model,
			 	type: this.data.type,
			 	player: this.data.players.models[index],
			 	list: this
			}).render();

			this.$el.prepend(_view.el);
			this.elements.push(_view);

			_view = null;
		},
		countRemaining: function(){
			this._selectedItems = 0;
			this.collection.each(function(item){ this._selectedItems += item.get('value');}, this);
			this.total.firstChild.value = Number(this._maxItems - this._selectedItems);
			this.total.lastChild.innerHTML = _g.util.plural(this.total.firstChild.value, 'item')+" left";
		},
		handleChangePlayer: function(player){
			if (player.get('_select') && this._selectedItems != 0){
				this.data.players.each(function(model, i){
					if (model != player){ model.set('_select', false);}
				});
			}
			this.countRemaining();
		}
	});
})