
describe("Project Specs", function(){
	xit("Bogus Test", function(){
		expect(true).toBeTruthy();
	})

	describe('Project views', function(){
		describe('List element view', function(){
			var view;
			it ('element must be correctly defined and have default value', function(){
				view = new ListItem();
				expect(view).toBeDefined();
				expect(view.el.tagName).toBe('LI');
				expect(view instanceof Backbone.View).toBeTruthy();
			})
			it ('default element must NOT selectable, deletable and sortable', function(){
				view = new ListItem().render()
				expect(view.$el.find('.delete').length).toBeFalsy()
				expect(view.$el.find('.sort').length).toBeFalsy()
				expect(view.$el.find('.select').length).toBeFalsy()
			})
			it ('must be selectable, deletable and sortable', function(){
				view = new ListItem({
					selectable: true,
					deletable: true,
					sortable: true
				}).render();
							
				expect(view.$el.find('.delete').length).toBe(1);
				expect(view.$el.find('.sort').length).toBe(1);
				expect(view.$el.find('.select').length).toBe(1);
			});

			it('',function(){

			});

			afterEach(function(){
				if(view){
					view.remove();
					view = null;	
				}
				
			});
		});
		
	})
})