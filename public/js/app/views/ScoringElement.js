define([
	'backbone'
	,'app/utils/Global'
	,'text!/templates/ScoringElement.html'
], function(B, _g, template){
	var _v, sum;
	return Backbone.View.extend({
		tagName: 'li',
		template: _.template(template),
		initialize: function(data){
			this.data = data;
			delete this.data.model;
			this.data.type = this.data.type || "normal";
			if (this.data.list){
				this.data._isRentz = this.data.list._gameType.get('type') === _g.gameType.RENTZ.get('type')
			}
		},
		render: function(){
			if (this.model){
				var obj = this.model.toJSON();
				obj.maxItems = typeof(obj.maxItems) != 'number' ? obj.maxItems() : obj.maxItems
				obj.type = this.data.type;
				_.bindAll(this, 'handlePlayerSelection','handlePlayerChange','handleInputChange')

				if (this.data.player){
					obj.icon = this.data.player.get('picture');
					obj.name = this.data.player.fullname();
					this.data.player.on('change:_select', this.handlePlayerChange);
				}

				this.$el.html(this.template(obj));
				this.el.dataset.id = this.model.cid
				//this.el.dataset.pid = this.data.player.cid; 
				
				if (this.data.type === 'normal'){
					this.$el.find('input').change(this.handleInputChange)
				}

				this.model.on('change:value', this.handleModelChange, this);
				this.item = this.$el.find('input.points')[0];

				if (this.data.player){
					this.icon = this.$el.find('a');
					this.icon.click(this.handlePlayerSelection);
				}				
				obj = null;
			}
			return this;
		},

		handleModelChange: function(model){
			_v = model.get('value');
			this.item.value = model.get('multiplier')*_v+" points";
			if (this.data.type === 'normal'){
				this.el.children[2].value = 
				this.el.children[1].value = _v;
			}
		},
		handlePlayerChange: function(model){
			this.model.set('value', model.changed._select ? 1 : 0)
		},
		handleInputChange: function(e){
			e.preventDefault();
			sum = 0;
			_v = e.target.value;
			_v = _v < this.data.list._maxItems ? _v : this.data.list._maxItems;
			_v = Number(_v);

			if(_v != e.target.value){ e.target.value = _v; }
			this.model.collection.each(function(item){ if (item != this.model){ sum += item.get('value');}}, this);
			if (_v + sum > this.data.list._maxItems){ _v = this.data.list._maxItems - sum}

			this.el.children[1].value = this.el.children[2].value = _v;
			this.model.set('value', _v);
		},
		handlePlayerSelection: function(e){
			e.preventDefault();
			if (this.data._isRentz) return;

			_v = this.data.player.get('_select');
			_v = !_v;
			this.data.player.set('_select',_v)
		}
	})
})