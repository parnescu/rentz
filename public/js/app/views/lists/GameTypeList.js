define([
	'backbone'
	,'app/utils/Global'
	,'text!/templates/GameTypeList.html'
], function(B, _g, tmp){
	return Backbone.View.extend({
		tagName: 'article',
		template: _.template(tmp),
		events: {
			"click a": "handleRoundSelect"
		},
		initialize: function(){
			
		},
		render: function(){
			if (this.model && this.collection){
				var _type, _enabled;
				trace(this.model.toJSON())
				this.$el.html(this.template(this.model));
				this.list = $(this.el.lastChild);
				this.collection.each(function(item, i){
					_type = item.get('gameType').get('type');
					_enabled = item.get('available');
					this.list.append("<li><a class='avatar' href='#selectRound' data-active='"+_enabled+"' data-round="+i+" class='"+_type+"'title='"+_type+"'>"+_type+"</a></li>");
				},this);
				_type = _enabled = null;
			}
			return this;
		},
		handleRoundSelect: function(e){
			e.preventDefault();
			Backbone.trigger(_g.events.CHOOSE_GAME_TYPE,this.collection.models[e.target.dataset.round]);
		}
	});
})