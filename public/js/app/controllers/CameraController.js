define([
	'app/utils/Global'
], function(_g){
	if (!window.__cc){
		var f = function(){
			_start = function(){
				// detect if webcam is available
				// if on mobile 	
			}
			_end = function(){
				
			}
			return {
				init: _start,
				remove: _end
			}
		}
		window.__cc = new f();
	}
	return window.__cc
});