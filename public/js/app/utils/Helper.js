define(function(){
	if (!window.__mrjn){
		var _utils = {}
		_utils.months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		_utils.plural = function(nr, str){
			if (str == "") return "";
			return str + (Number(nr) === 1 ? "" : "s")
		}
		_utils.merge = function(data, obj){
			for (var ii in obj){
				data[ii] = obj[ii];
			}
		}
		_utils.format = function(date, style){
			var str = "";
			style = style || "dd MM yyyy";
			switch(style){
				case "dd MM yyyy":
					str += date.getDate()+" "+_utils.months[date.getMonth()]+" "+date.getFullYear();
					break;
			}
			return str;
		}
		_utils.progressive = function(nr){
			var sum = 1;
			for (var i=2;i<=nr;i++) { sum += i; }
			return sum;
		}
		_utils.playerRoundByType = function(player, type, collection){
			var i,model;
			for (var i=0;i<collection.models.length;i++){
				model = collection.models[i];
				if (model.get('playerId') === player && model.get('gameType').get('type')  === type){
					return model;
				}
			}
		}
		_utils.updateRound = function(game, model){
			// used for TDD tests
			var i = Number(game.get('_index'));
			i++;

			model.isValid();
			model.set("_index",i);
			game.set('_index',i);
			game.isValid();
		}
		window.__mrjn = _utils;
	}
	
	return window.__mrjn;
})