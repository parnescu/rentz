define([
	'backbone'
	,'app/utils/Global'
	,'text!/templates/PlayerListElement.html'
	,'text!/templates/GameListElement.html'
], function(B, _g, playerTemplate, gameTemplate){
	return Backbone.View.extend({
		tagName: 'li',
		data: { type: 'player'},
		events: {
			'click a': 'handleClick'
		},
		initialize: function(data){
			if (data){
				_g.util.merge(this.data, data)
				this.model = data.model || null;
				if (this.model){ 
					this.model.on('change', this.handleChange, this);
				}
			}
		},
		render: function(){
			if (this.model){ this.data.values = this.model.toJSON();}
			this.$el.html(_.template(this.data.type != 'player' ? gameTemplate : playerTemplate)(this.data));

			this.buttons = {}
			this.buttons.select = this.$el.find('a[data-type=select]');
			this.buttons.delete = this.$el.find('a[data-type=delete]');
			this.buttons.sort = this.$el.find('a[data-type=sort]');

			if (this.data.index){
				this.el.dataset.pos = this.data.index
			}

			return this;
		},
		handleChange: function(model){
			if (model.changed.name || model.changed.surname || model.changed.nick){
				this.render();
			}
			
			if (this.model.get('_select')){
				this.$el.addClass('selected');
				this.buttons.select.addClass('selected')
			}else{
				this.$el.removeClass('selected');
				this.buttons.select.removeClass('selected')
			}
		},
		handleClick: function(e){
			var val, type = e.target.dataset.type, allowChange = true;

			switch(type){
				case "delete":
					Backbone.trigger(_g.events.LIST_ITEM_DELETED, this);
					break;
				case "select":
					val = !this.model.get('_'+type);			

					if(this.counter){
						allowChange = val ? this.counter.max > this.counter.value : true;	
					}
					
					if (val){ 
					 	if (allowChange){
						 	this.model.set('_'+type, val);
						 	Backbone.trigger(_g.events.LIST_CLICK, this.model);
					 	}else{
					 		// max reached do nothing
					 	}
					}else{
						// de-select item - allow triggering
						this.model.set('_'+type, val);
						Backbone.trigger(_g.events.LIST_CLICK, this.model);
					}	
					break;
				default:
					Backbone.trigger(_g.events.LIST_CLICK, this.model);
					break;
			}		
			val = type = allowChange = null;
			e.preventDefault();
		}
	});
})