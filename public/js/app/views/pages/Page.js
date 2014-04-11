define([
	'backbone'
	,'app/utils/Global'
	,'app/views/pages/Header'
], function(B, _g, Header){
	"use strict";
	return Backbone.View.extend({
		className: 'page',
		viewType: null,
		events:{
			"click a.navlist": "handleNavClick"
		},
		attributes:{
			"data-role": "page"
		},
		initialize: function(data){
			this.data = data
			this.viewType = data.type ? data.type.type : null;
			/*
				page has these objects defined:
					- head 		[ header view ]
					- subview 	[ list view ]
					- content 	[ section jquery object]
					- menu  	[ footer jquery object ]
			*/

			if (data.type && data.header && !data.header.title){
				data.header.title = data.type.title
			}
		},
		render: function(){
			if (this.viewType){
				this.$el.addClass(this.viewType);
			}
			if (this.data.header){
				this.data.header.title = this.data.header.title || (this.model ? this.model.fullname() : "")
				this.head = new Header(this.data.header).render()
				this.$el.append(this.head.el);
			}

			this.$el.append('<section class="content"></section>');
			this.content = $(this.el.lastChild);

			if (this.data.view){
				if (this.subview){ this.subview.remove(); }
				this.subview = this.data.view.render()
				this.content.append(this.subview.el);
			}

			if (this.data.menu){
				this.$el.append('<footer><ul class="nav"></ul></footer>');
				this.menu = $(this.el.lastChild.firstChild);

				// jqm items
				var f = this.$el.find('footer')[0];
				f.dataset.role = "footer";
				f.dataset.position = "fixed";
				this.menu[0].dataset.role = "navbar"
				this.menu[0].dataset.iconpos = "top"
				// - end jqm

				this.menu.addClass("items_"+this.data.menu.length)
				_.each(this.data.menu,function(item, index){
					this.menu.append("<li><a href='#"+item.type+"' data-id='"+item.type+"' title='"+item.title+"' class='navlist'>"+item.title+"</a></li>");
					if (this.data.type && this.data.type.type === item.type){
						$(this.menu[0].lastChild.firstChild).addClass('selected');
					}
				}, this);
			}

			this.$el.trigger('create');
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