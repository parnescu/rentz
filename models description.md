/*
	 	-- app models 
		
		player model {
			_select:  	boolean, [ used in list points counter ]
			_delete:  	boolean,
			id: 		uint,
			name: 		string,
			surname: 	string,
			nick: 		string,
			picture: 	string [ base64encoded img data ]
		}

		game type model {
			type: 			string, [ one of the seven playable types ]
			icon: 			string, [ base64encoded img data ]
			multiplier: 	int [ number of points per item ]
			maxItems: 		int [ number of items possible]
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