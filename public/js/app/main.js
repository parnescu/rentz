define([
	'jquery'
	,'app/utils/Global'
], function($, _g){
	$(function(){
		var trace = function(r){console.log(r);}

		var globalMaxItems = 4,
			multiplier = -50,
			maxItems = 0,
			sliders = $('.slider'),
			inputs = $('.items'),
			total = $('#remaining');

		_getValue = function(event){
			var element = event.target,
				className = "."+element.className,
				_v = Number(element.value),
				_other = element.parentElement.children[className != '.slider' ? 1 : 2]
				_points = element.parentElement.lastElementChild,
				_sum = 0;

			_v = _v < 0 ? 0 : _v > globalMaxItems ? globalMaxItems : _v;
			$(className).each(function(i, item){ if (item != element){_sum += Number(item.value)}});
			if (_v + _sum > globalMaxItems){ _v = globalMaxItems - _sum}
			this.value = _other.value = _v
			_points.value = multiplier*_v + " points";
			total.val(globalMaxItems-_sum - _v);
			element = className = _v = _other = _sum = null;
		}

		inputs.change(_getValue);
		sliders.attr('max', globalMaxItems).change(_getValue);
		total.val(globalMaxItems);

		// var canvas = document.createElement('canvas'),
		// 	ctx = canvas.getContext('2d');
		// canvas.width = canvas.height = 128;

		// var img = new Image();
		// img.src = "/res/logo.png";
		// img.onload = function(){
		// 	ctx.drawImage(img,0,0,128,128);
		// 	var d = document.createElement('img');
		// 	d.src = canvas.toDataURL()
		// 	trace(canvas.toDataURL());
		// 	$('section').append(d);
		// }	
	})

	/*
	 	-- app models 
		player model {
			id: 		uint,
			name: 		string,
			surname: 	string,
			nick: 		string,
			picture: 	string [ base64encoded img data ]
		}

		game type model {
			type: 		string, [ one of the seven playable types ]
			icon: 		string, [ base64encoded img data ]
			scoring: 	<scoring model>
		}

		scoring model {
			multiplier: 	int,
			value: 			int,
			maxItems: 		int
		}

		round model {
			playerId: 	uint,
			available: 	boolean, [ when round is finished it's not available to be chosen ]
			gametype: 	string, 
			scores: 	object [ calculated scores for each player]
		}
		
		game model:{
			id: 		uint,
			name: 		string, [  ]
			players: 	array[uint], [ player ids arranged by score, first one is the winner ]
			rounts: 	array[<round model>],
			count: 		uint [number of players to prevent players.length ]
		}
	*/



})
