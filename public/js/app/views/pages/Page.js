define([
	'backbone',
	'app/views/pages/Header'
], function(B, Header){
	return Backbone.View.extend({
		className: 'page',
		events:{
			"click a.navlist": "handleNavClick"
		},
		initialize: function(data){
			this.data = data
		},
		render: function(){
			if (this.data.type){
				this.$el.addClass(this.data.type);
			}
			if (this.data.header){
				this.$el.append(new Header(this.data.header).render().el);
			}
			this.$el.append('<section class="content"></section>');
			if (this.data.view){
				this.$el.append(this.data.view.render().el);
			}
			if (this.data.menu){
				this.$el.append('<footer><ul class="nav"></ul></footer>');
				_.each(this.data.menu,function(item, index){
					$(this.el.lastChild.firstChild).append("<li><a href='#"+item.type+"' data-id='"+item.type+"' title='"+item.title+"' class='navlist'>"+item.title+"</a></li>")
					if (this.data.type === item.type){
						$(this.el.lastChild.firstChild.lastChild.firstChild).addClass('selected');
					}
				}, this);
			}
			return this;
		},
		handleNavClick: function(e){
			e.preventDefault();
			this.$el.find('footer ul a').removeClass('selected');
			$(e.target).addClass('selected');
			Backbone.trigger(_g.events.NAV_CLICKED, e.target.dataset.id);
		}
	})
})