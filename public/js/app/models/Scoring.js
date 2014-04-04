define(['backbone'],function(B){
	return Backbone.Model.extend({
		defaults: {
			multiplier: 1,
			value: 0,
			maxItems: 1
		},
		validate: function(){
			if (this.get('value') > this.get('maxItems')){
				return 'You cannot add more items than it is allowed';
			}
		},
		getScore: function(){
			return this.get('value')*this.get('multiplier');
		}
	});
})