module.exports = function(config){
	"use strict"
	var mongo = require('mongoose'),
		q  = require('q'),
		url = require('url'),
		db = mongo.connection,
		connection = ["mongodb:/",config.host+(config.port ? ":"+config.port : ""), config.db].join("/"),
		ObjectId = mongo.Schema.Types.ObjectId,
		f = function(req, res){ res.json('it be workin')};
	
	trace('DB:: init ' + connection);
	db.on('error', function(){ trace('DB:: could not connect to db');});
	db.once('open', function(){ trace('DB:: connected to db');});
	mongo.connect(connection);

	// SCHEMAS
		var player = mongo.Schema({
			name: String
			,surname: String
			,nick: String
			,won: Number
			,userId: Number
			,password: String
			,picture: { type:String, default: "data:image/png;base64,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"}
		}),
		scoring = mongo.Schema({
			value: { type: Number, default: 0},
			maxItems: { type: Number, default: 1},
			multiplier: { type: Number, default: 0}
		}),
		gametype = mongo.Schema({
			type: String,
			multiplier: Number,
			maxItems: Number
		}),
		gameround = mongo.Schema({
			playerId: ObjectId,
			available: { type: Boolean, default: true},
			gameType: [gametype],
			scores: [scoring],
			_points: [Number]
		}),
		game = mongo.Schema({
			playerId: ObjectId,
			name: { type:String, default: Date.now()},
			rounds: [gameround],
			players: [String],
			_points: [Number],
			_winner: { id: String, score: Number}
		});

		var Player = mongo.model('Player', player),
			Scoring = mongo.model('Scoring', scoring),
			GameType = mongo.model('GameType', gametype),
			Round = mongo.model('Round', gameround),
			Game = mongo.model('Game', game),

		_getModelType = function(type){
			switch(type){
				case "player":
					return Player;
					break;
				case "scoring":
					return Scoring;
					break;
				case "game":
					return Player;
					break;
				default:
					return;
					break;
			}
		}
	// END - SCHEMAS

	// MONGO 
		var _removeItem = function(id, type){
			type = type || 'player';
			
			var model = _getModelType(type),
				def = q.defer();

			if(model){
				model.findOneAndRemove({_id: id}, function(e, docs){
					if (e){ def.reject(e.err);
					}else{ def.resolve();}
				});
			}else{
				def.reject("NO SUCH TYPE AVAILABLE: "+type);
			}

			return def.promise;
		},
		_setItem = function(data){
			var model = _getModelType(data._type),
				def = q.defer();

			if (model){
				delete data._type;
				if(data._id){
					var id = data._id;
					delete data._id
					model.findOneAndUpdate({_id: id},data, {_v: 0},function(e, docs){
						if (e){ def.reject(e.err);
						}else{
							if (docs){ def.resolve(docs);	
							}else{ def.reject("No items found");}
						}
					});
					id = null;
				}else{
					model = new model(data);
					model.save(function(e, docs){
						if(e){ def.reject(e.err);
						}else{ def.resolve(docs);}
					});
				}
			}else{
				def.reject("NO SUCH TYPE AVAILABLE: "+data._type);
			}

			return def.promise;
		},
		_getItem = function(data){
			var model = _getModelType(data._type),
				def = q.defer();
			if (model){
				delete data._type;
				model.findOne(data, {_v:0}, function(e, docs){
					if (e) { def.reject(e)
					}else if(docs){ def.resolve(docs)
					}else{ def.reject("NO SUCH ITEM AVAILABLE")}

				})
			}
			return def.promise;
		},
		_getItems = function(type, filter){
			var model = _getModelType(type),
				def = q.defer();

			filter = filter || {};

			if (model){
				model.find(filter,{__v:0},function(e,docs){
					if (e){ def.reject(e);
					}else{ def.resolve(docs);}
				});
			}else{
				def.reject("NO SUCH TYPE AVAILABLE: "+data._type);
			}
			return def.promise;
		},
	// END - MONGO



	// HANDLERS
		_savePlayer = function(req, res){
			var data = req.body;
			data._type = 'player';

			if (data._id){
				trace("DB:: save player with id: "+req.params.id);	
			}else{
				trace("DB:: add new player");
			}
			
			_setItem(data).then(
				function(player){
					trace("DB:: -> save success");
					res.json(player);
				},
				function(e){
					trace("DB:: ---> save failed: "+e);
					res.send(500, { reason: e});
				}
			);
		},
		_getPlayers = function(req, res){
			trace("DB:: show all players");
			_getItems('player').then(
				function(players){
					res.json(players);
				},
				function(e){
					trace("DB:: ---> save failed: "+JSON.stringify(e));
					res.send(500, { reason: e});
				}
			);
		},
		_removePlayer = function(req,res){
			trace("DB:: remove player with id: "+req.params.id);

			_removeItem(req.params.id).then(
				function(players){
					res.json(true);
				},
				function(e){
					trace("DB:: ---> removal failed: "+JSON.stringify(e));
					res.send(500, { reason: e});
				}
			);

			res.json(false);
		},
		_getUser = function(req, res){
			var params = url.parse(req.url, true).query,
				obj = {_type: 'player', nick: params.nick}

			if (params.pass) { obj.password = params.pass;}

			trace("DB:: get user "+params.nick);
			_getItem(obj).then(function(data){
				trace('DB:: user found: '+data._id);
				res.json(data)
			}, function(e){
				res.json(500,{ reason: e});
			});
			obj = null;
		}
	// END - HANDLERS
	return {
		getPlayers: _getPlayers
		,savePlayer: _savePlayer
		,deletePlayer: _removePlayer
		,loginUser: _getUser
	}
}