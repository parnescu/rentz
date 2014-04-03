
describe("Rentz TDD specs", function(){
	var model, collection, stage = $('#stage'),
		bogusPlayers = [
			{ name:"Gigi", surname:"Kent", nick:'Shigy'}
			,{ name:"Lebby", surname:"Coarse", nick:'mutaflex'}
			,{ name:"Olga", surname:"Cracinova", nick:'Lebby', picture:'data:image/png;base64,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'}
		],
		bogusPlayersAdd = [
			{ name:"Ito", surname:"Akuji", nick:'flebark'}
			,{ name:"Ashura", surname:"Keniji", nick:'mrcanton'}
			,{ name:"Lancaster", surname:"Void", nick:'rikudanton'}
		],
		bogusPlayersMore = [
			{ name:"Gigi", surname:"Castelano", nick:'tzatzemoi'}
		]
		bogusGames = [];
		window.view = null;
	describe('Views', function(){
		describe('List element view', function(){
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
			it ('must be selectable, deletable and sortable and have a type defined', function(){
				view = new ListItem({
					selectable: true,
					deletable: true,
					sortable: true
				}).render();
							
				expect(view.$el.find('a[data-type=delete]').length).toBe(1);
				expect(view.$el.find('a[data-type=sort]').length).toBe(1);
				expect(view.$el.find('a[data-type=select]').length).toBe(1);

				expect(view.data.type).toBeDefined();
				expect(view.data.type).toBe('player')
			});

			it('adding a player model generates details and listens to changes',function(){
				model = new Player(bogusPlayers[0]);
				view = new ListItem({
					selectable: false,
					deletable: true,
					sortable: false,
					model: model
				}).render();

				expect(view.$el.find('.playerName').text()).toBe(model.get('name') + " " +model.get('surname'))
				expect(view.$el.find('.playerNick').text()).toBe('nickname: '+model.get('nick'))
				expect(view.$el.find('.gamesWon').text()).toBe("games won: 0");

				model.set('name', 'Feriga');
				expect(view.$el.find('.playerName').text()).toBe("Feriga " +model.get('surname'))
			});

			it('adding a game model generates details differently',function(){
				model = new Game({
					name: new Date().toString()
				});
				view = new ListItem({
					selectable: false,
					deletable: true,
					sortable: false,
					type: 'game',
					model: model
				}).render();
				
				expect(view.$el.find('h2 a').text()).toBe(model.get('name'))
				expect(view.$el.find('.playerNick').length).toBe(0)
			});

			afterEach(function(){
				if(view){
					view.remove();
					view = null;	
				}
				if(model){
					model.destroy();
					model = null;
				}
			});
		});
		
		describe('List view', function(){
			var c;
			beforeEach(function(){
				c = Backbone.Collection.extend({ model: Player });
				collection = new c()
				collection.add(bogusPlayers);
			});

			it('element must be corectly defined and have a collection available', function(){
				view = new List()
				
				expect(view).toBeDefined();
				expect(view.tagName).toBe('ul');
				expect(view.render().el.children.length).toBe(0);
				expect(view.className.indexOf('list')).toBeGreaterThan(-1);
				expect(view.collection).toBeNull();
			});

			it('adding a collection generates list based on model type', function(){
				view = new List({collection: collection}).render();
				expect(view.el.children.length).toBeGreaterThan(0);
			});

			it('generate sortable, deletable and selectable list', function(){
				view = new List({ 
					sortable: true,
					selectable: true,
					deletable: false,
					collection: collection
				}).render();

				expect(view.$el.hasClass('withSelect')).toBeTruthy();
				expect(view.$el.hasClass('withDelete')).not.toBeTruthy();
				expect(view.$el.hasClass('withSort')).toBeTruthy();
			});

			it('generate sortable, deletable and selectable list', function(){
				view = new List({ 
					sortable: true,
					selectable: true,
					deletable: false,
					collection: collection
				}).render();

				expect(view.$el.hasClass('withSelect')).toBeTruthy();
				expect(view.$el.hasClass('withDelete')).not.toBeTruthy();
				expect(view.$el.hasClass('withSort')).toBeTruthy();
			});

			it('generate selectable list with max items', function(){
				view = new List({ 
					collection: collection,
					selectable: true,
					minItems: 2,
					minItemsLabel: "% player"
				}).render();
				expect(view.$el.hasClass('withSelect')).toBeTruthy();
				
				expect(view.$el.find('li.description').length).toBeGreaterThan(0);
				expect(view.$el.find('li.description label').length).toBeGreaterThan(0);
				expect(view.$el.find('li.description label').text()).toBe("2 players");
				
				view.$el.find('li a[data-type=select]:eq(1)').click();
				expect(view.$el.find('li.description label').text()).toBe("1 player");
				expect(view.$el.find('li a[data-type=select]:eq(1)').parent().hasClass('selected')).toBeTruthy();

				view.$el.find('li a[data-type=select]:eq(0)').click();				
				expect(view.$el.find('li.description label').text()).toBe("0 players");

				view.$el.find('li a[data-type=select]:eq(1)').click();
				expect(view.$el.find('li.description label').text()).toBe("1 player");

				view.$el.find('li a[data-type=select]:eq(1)').click();
				expect(view.$el.find('li.description label').text()).toBe("0 players");
				
				view.collection.add({ name: 'fenix', surname:'wells'});
				expect(view.el.lastChild.className).toEqual('description')
			});

			afterEach(function(){
				c = null;
				if(collection){
					collection.reset();
					collection = null;
				}
				if(view){
					view.remove();
					view = null;	
				}
				if(model){
					model.destroy();
					model = null;
				}
			});
		});

		describe('Score points element', function(){
			beforeEach(function(){
				var gameType = _g.gameType.DAMES
				model = new Score({
					maxItems: gameType.get('maxItems'),
					multiplier: gameType.get('multiplier')
				});
			});
			it('must be correctly defined and have model data', function(){
				view = new ScoreElement({ 
					model: model
				}).render();

				expect(view.model).toBeDefined();
				expect(view.$el.find('input').length).toBeGreaterThan(2);
				
				view.model.set('value', 3)
				expect(view.$el.find('input.points')[0].value).toBe('-150 points');
				
				view.model.set('value', 234)
				expect(view.model.isValid()).toBeFalsy();

				view.model.set('value', 2)
				expect(view.model.get('value')).toEqual(2);

			});

			it('icon type must be have a different setup', function(){
				view = new ScoreElement({ 
					model: model
					,player: new Player(bogusPlayers[1])
					,type: 'icon'
				}).render();

				expect(view.$el.find('a').length).toBeGreaterThan(0);
				expect(view.$el.find('img').length).toBeGreaterThan(0);
				expect(view.$el.find('input').length).toEqual(1);
				expect(view.$el.find('a').attr('title')).toBe('Lebby Coarse')

				view.$el.find('a').click()
				expect(view.model.get('value')).toBeGreaterThan(0)
				expect(view.$el.find('input.points')[0].value).toBe('-50 points');

				view.$el.find('a').click()
				expect(view.model.get('value')).toBe(0)
				expect(view.$el.find('input.points')[0].value).toBe('0 points');
			});

			afterEach(function(){
				if(view){
					view.remove();
					view = null;	
				}
				if(model){
					model.destroy();
					model = null;
				}
			})
		});

		describe('Score points list - red priest game type', function(){
			var c,gameType, playerCollection;
			beforeEach(function(){
				gameType = _g.gameType.RED_PRIEST
				c = Backbone.Collection.extend({ model: Score });
				p = Backbone.Collection.extend({ model: Player });

				playerCollection = new p();
				playerCollection.add(bogusPlayers);

				collection = new c();
				for (var i=0;i<bogusPlayers.length;i++){
					collection.add(new Score({ 
						maxItems: gameType.get('maxItems'), 
						multiplier: gameType.get('multiplier')
					}));
				}
			});

			it('must be corectly defined and fuction', function(){
				view = new ScoreList({
					players: playerCollection
					,collection: collection
					,gameType: gameType
					,type: 'icon'
				}).render();
				
				expect(view.$el.find('a').length).toBe(_g.currentPlayers);
				expect(Number(view.total.firstChild.value)).toEqual(1);

				view.$el.find('a:eq(2)').click();
				expect(Number(view.total.firstChild.value)).toEqual(0);

				view.$el.find('a:eq(0)').click();
				expect(Number(view.total.firstChild.value)).toEqual(0);

				view.$el.find('a:eq(0)').click();
				expect(Number(view.total.firstChild.value)).toEqual(1);

			});

			afterEach(function(){
				c = gameType = null;

				if (collection){
					collection.reset();
					collection = null;
				}
				if(view){
					view.remove();
					view = null;	
				}
				if(model){
					model.destroy();
					model = null;
				}
			});
		});

		describe('Score points list - dames (or normal) game type', function(){
			var c,gameType, playerCollection;
			beforeEach(function(){
				gameType = _g.gameType.DAMES
				c = Backbone.Collection.extend({ model: Score });
				p = Backbone.Collection.extend({ model: Player });

				playerCollection = new p();
				playerCollection.add(bogusPlayers);

				collection = new c();
				for (var i=0;i<bogusPlayers.length;i++){
					collection.add(new Score({ 
						maxItems: gameType.get('maxItems'), 
						multiplier: gameType.get('multiplier')
					}));
				}
			});
			
			it('must be corectly defined and fuction', function(){
				view = new ScoreList({
					players: playerCollection
					,collection: collection
					,gameType: gameType
				}).render();

				expect(Number(view.total.firstChild.value)).toBe(gameType.get('maxItems'));
				
				/*
					can't really test value changes automagically... 
					input value change from code does not trigger modification
					so we manually modify the model 
				*/

				stage.append(view.el)
				
				// change slider
				var _target = view.$el.find('input[type=range]:eq(0)');
				
				_target.val(2);
				view.elements[2].model.set('value', Number(_target.val()))
				expect(view.total.firstChild.value).toBe('2');
				expect(_target.parent()[0].lastChild.value).toBe('-100 points');
				
				_target.val(312);
				view.elements[2].model.set('value', Number(_target.val()))
				expect(view.total.firstChild.value).toBe('0');
				expect(_target.parent()[0].lastChild.value).toBe('-200 points');

				// change number input
				_target = view.$el.find('input[type=number]:eq(0)');
				
				_target.val(2)
				view.elements[2].model.set('value', Number(_target.val()))
				expect(view.total.firstChild.value).toBe('2');
				expect(_target.parent()[0].lastChild.value).toBe('-100 points');
				
				_target.val(0)
				view.elements[2].model.set('value', Number(_target.val()))
				expect(view.total.firstChild.value).toBe('4');
				expect(_target.parent()[0].lastChild.value).toBe('0 points');
				
				_target.val(3)
				view.elements[2].model.set('value', Number(_target.val()))
				expect(view.total.firstChild.value).toBe('1');
				expect(_target.parent()[0].lastChild.value).toBe('-150 points');			
			});

			afterEach(function(){
				c = gameType = null;
				if (collection){
					collection.reset();
					collection = null;
				}
				if(view){
					view.remove();
					view = null;	
				}
				if(model){
					model.destroy();
					model = null;
				}
			});
		});

		describe('Score points list - rentz game type (6 players)', function(){
			var c,gameType, playerCollection;
			beforeEach(function(){
				gameType = _g.gameType.RENTZ
				c = Backbone.Collection.extend({ model: Score });
				p = Backbone.Collection.extend({ model: Player });

				playerCollection = new p();
				playerCollection.add(bogusPlayers);
				playerCollection.add(bogusPlayersAdd);


				collection = new c();
				for (var i=0;i<playerCollection.models.length;i++){
					collection.add(new Score({ 
						maxItems: gameType.get('maxItems'), 
						multiplier: gameType.get('multiplier')
					}));
				}
			});

			it('must be corectly defined and fuction', function(){
				view = new ScoreList({
					players: playerCollection
					,collection: collection
					,gameType: gameType
					,sortable: true
					,type: 'icon'
				}).render();		
				var _target = view.elements[2];

				expect(Number(view.total.firstChild.value)).toBe(21);
				expect(view.elements[0].model.get('value')).toBe(1);
				expect(view.elements[1].model.get('value')).toBe(2);
				expect(view.elements[2].model.get('value')).toBe(3);
				expect(view.elements[5].model.get('value')).toBe(6);
				expect(view.collection.get(_target.model.cid).get('value')).toBe(3)
				
				// emulate sorting - move third player to first
				view.$el.prepend(_target.el);
				view.handleSorting();
				expect(view.collection.get(_target.model.cid).get('value')).toBe(6)
				expect(_target.el.lastChild.value).toBe('300 points')

				// emulate sorting - move first player to last
				view.$el.find('li.description').before(_target.el)
				view.handleSorting();
				expect(view.collection.get(_target.model.cid).get('value')).toBe(1)
				expect(_target.el.lastChild.value).toBe('50 points')
			});

			afterEach(function(){
				c = gameType = null;
				if (collection){
					collection.reset();
					collection = null;
				}
				if(view){
					view.remove();
					view = null;	
				}
				if(model){
					model.destroy();
					model = null;
				}
			});
		});

		describe('Players form view', function(){
			it('correctly defined with elements for name, surname, nick, photo and games won', function(){
				view = new EditPlayers().render();

				expect(view.el.tagName.toLowerCase()).toBe('form')
				expect(view.el.children.length).toBeGreaterThan(0);
				expect(view.$el.find('input').length).toBe(3);
				expect(view.model).toBeNull();
				expect(view.submit).toBeDefined();
				expect(view.cancel).toBeDefined();

				view.submit.click();
				expect(view.model).not.toBeNull();
			});

			it('adding a model can save/modify a player and his data', function(){
				model = new Player();
				view = new EditPlayers({model: model }).render();

				view.$el.find('input[name=nick]').val('gigel');
				view.$el.find('input[name=name]').val('Horezu');
				view.$el.find('input[name=surname]').val('Alexandrovici');

				view.submit.click();
				expect(view.model.get('nick')).toBe('gigel');
				expect(view.model.isValid()).toBeTruthy();
				view.cancel.click();
				view.submit.click();
				expect(view.model.isValid()).toBeFalsy();

				view.$el.find('input[name=nick]').val(' ');
				view.$el.find('input[name=name]').val('       ');
				view.$el.find('input[name=surname]').val('      ');
				view.submit.click();
				
				expect(view.model.isValid()).toBeFalsy();
			});

			it('existing data can be changed or reverted back', function(){
				model = new Player(bogusPlayersAdd[1]);
				view = new EditPlayers({model: model }).render();
				
				expect(view.$el.find('input[name=nick]').val()).toBe('mrcanton')
				
				view.$el.find('input[name=nick]').val('shugarTits')
				view.submit.click();
				expect(view.model.get('nick')).toBe(view.$el.find('input[name=nick]').val())

				view.cancel.click();
				expect(view.model.get('nick')).toBe('mrcanton')
			});

			afterEach(function(){
				if(view){
					view.remove();
					view = null;
				}
				if(model){
					model.destroy();
					model = null;
				}
			});
		});
		
		describe('Header view', function(){
			var val, backC, fwC;
			beforeEach(function(done){
				setTimeout(function(){
					backC = function(){ val = "back was clicked";}
					fwC = function(){ val = "continue was clicked";}
					Backbone.on(_g.events.HEAD_CLICK_BACK, backC);
					Backbone.on(_g.events.HEAD_CLICK_CONTINUE, fwC);
					done();
				},1);
			});

			it("must be correctly defined and service all types", function(done){
				view = new Header({
					back: {
						title: "Back",
						type: "sharedView"
					},
					title: "new header title",
					next: {
						title: "New action",
						type: "newAction"
					}
				}).render();

				expect(view.el.tagName).toBe('HEADER');
				expect(view.el.children.length).toEqual(3);
				expect(view.$el.find('a.back').attr('href')).toBe('#sharedView');
				
				view.$el.find('a.next').click();
				expect(val).toBe("continue was clicked");
				
				view.$el.find('a.back').click();
				expect(val).toBe("back was clicked");
				done();			
			});

			afterEach(function(){
				Backbone.off(_g.events.HEAD_CLICK_BACK, backC);
				Backbone.off(_g.events.HEAD_CLICK_CONTINUE, fwC);
				backC = fwC = val = null;
				if (view){
					view.remove()
					view = null;
				}
			})
		});

		describe('Page view', function(){
			var val, clsr;
			beforeEach(function(done){
				setTimeout(function(){
					clsr = function(e){ val = e;}
					Backbone.on(_g.events.NAV_CLICKED, clsr);
					done();
				},1);
			});

			it("must be correctly defined and sercvice all types", function(done){
				view = new Page({
					type: "gamesScreen",
					menu: [
						_g.viewType.GAMES_SCREEN
						,_g.viewType.PLAYERS_LIST_SCREEN
					],
					header: {
						back: _g.viewType.EDIT,
						title: "Games",
						next: _g.viewType.PLAYER_EDIT_SCREEN
					}
				}).render();

				view.$el.find('.nav a:eq(0)').click();
				expect(view.$el.find('.nav a:eq(0)').hasClass('selected')).toBeTruthy();
				expect(val).toBe("gamesScreen");

				view.$el.find('.nav a:eq(1)').click();
				expect(val).toBe("playersScreen");
				expect(view.$el.find('.nav a:eq(0)').hasClass('selected')).not.toBeTruthy();
				stage.append(view.el);

				done();
			});

			afterEach(function(){
				Backbone.off(_g.events.NAV_CLICKED, clsr);
				clsr = null;
				if (view){
					view.remove();
					view = null;
				}
			});
		});

		describe("New game - player selection page", function(){
			beforeEach(function(){
				_g.players.add(bogusPlayers);
				_g.players.add(bogusPlayersAdd);
				_g.players.add(bogusPlayersMore);

				view = new Page({
					type: _g.viewType.PLAYERS_SELECT_SCREEN.type,
					menu: [
						_g.viewType.PLAYER_EDIT_SCREEN
						,_g.viewType.GAME_QUIT_SCREEN
					],
					header: {
						title: "Select users",
						next: _g.viewType.PLAYERS_SORT_SCREEN
					},
					view: new List({
						selectable: true,
						maxItems: 6,
						collection: _g.players
					})
				}).render();

				MainController.init(view);
				stage.append(view.el);
			});

			xit("add new player from selection screen", function(){
				view.menu.find('a:eq(0)').click();

				var m = MainController.view();
				m.$el.find('input[name=nick]').val('cireshescu');
				m.$el.find('input[name=name]').val('Vasile');
				m.$el.find('input[name=surname]').val('Ionela');
				m.$el.find('button.submit').click()

				expect(m.subview.model.isValid()).toBeTruthy();
				expect(_g.players.models[7].get('nick')).toBe('cireshescu');

				m = null;
			});

			xit("select three players to play, add them to next step and go back", function(){
				view.subview.$el.find('a[data-type=select]:eq(2)').click();
				view.subview.$el.find('a[data-type=select]:eq(3)').click();
				view.subview.$el.find('a[data-type=select]:eq(4)').click();
				expect(view.subview.$el.find('a.selected').length).toEqual(3);

				view.head.$el.find('a').click();

				var m = MainController.view();
				expect(stage[0].children.length).toBe(2);
				expect(m.subview.collection).toBe(_g.sPlayers);

				// olga is last, make her the first, make ashura the last from 2nd
				m.subview.$el.prepend(m.subview.$el.find('li:eq(2)'));
				m.subview.$el.append(m.subview.$el.find('li:eq(1)'));
				m.subview.handleSorting()
				
				expect(m.subview.collection.models[0].fullname()).toBe('Olga Cracinova')
				expect(m.subview.collection.models[1].fullname()).toBe('Ito Akuji')

				m.head.$el.find('a:eq(0)').click();
				expect(stage[0].children.length).toBe(1);
				expect(_g.sPlayers.length).toBe(3);
				m = null;
			});

			xit("select seven players and fail to play", function(){
				view.subview.$el.find('a[data-type=select]').click();
				expect(function(){ view.head.$el.find('a').click() }).toThrowError();
			});

			it("select five players to play, add them to next step and start new game", function(){
				view.subview.$el.find('a[data-type=select]:even').click();
				view.subview.$el.find('a[data-type=select]:eq(1)').click();

				view.head.$el.find('a').click();
				var m = MainController.view();
				m.subview.$el.prepend(m.subview.$el.find('li:eq(3)'));

				m.head.$el.find('a:eq(1)').click();
				
				m = null;
			});

			afterEach(function(){
				return;
				_g.players.reset();
				if (view){
					view.remove()
					view = null;
				}
			});
		});
	});
	xdescribe("Controllers", function(){
		describe("Main Screen Controller", function(){
			beforeEach(function(){
				_g.players.add(bogusPlayers);

				view = new Page({
					menu: [
						_g.viewType.GAMES_SCREEN
						,_g.viewType.PLAYERS_LIST_SCREEN
					],
					header: {
						back: _g.viewType.EDIT,
						title: "Players",
						next: _g.viewType.PLAYER_EDIT_SCREEN
					}
				}).render();
			});

			it("you can switch between games/players lists", function(){
				expect(function(){ MainController.init()}).toThrowError();
				expect(function(){ MainController.init(view)}).not.toThrowError();
				MainController.init(view);
				stage.append(view.el);

				view.menu.find('a:eq(1)').click();
				expect(view.head.title.text()).toBe("Players");
				expect(view.subview).not.toBeNull();
				expect(view.viewType).toBe(_g.viewType.PLAYERS_LIST_SCREEN.type);

				view.menu.find('a:eq(0)').click();
				expect(view.head.title.text()).toBe("Games");
				expect(view.subview.el.children.length).toBe(0);
				expect(view.viewType).toBe(_g.viewType.GAMES_SCREEN.type);

				view.menu.find('a:eq(1)').click();
			});

			it("create/edit new player", function(){
				stage.append(view.el);

				MainController.init(view);
				view.menu.find('a:eq(1)').click();
				view.head.$el.find('a:eq(1)').click();
				
				expect(_g.players.models.length).toBe(3);
				expect(stage[0].children.length).toBeGreaterThan(1);

				var m = MainController.view()
				m.$el.find('input[name=nick]').val('cireshescu');
				
				m.$el.find('input[name=surname]').val('Ionela');
				m.$el.find('button.submit').click()

				expect(m.subview.model.isValid()).toBeFalsy();

				m.$el.find('input[name=name]').val('Vasile');
				m.$el.find('button.submit').click()

				expect(m.subview.model.isValid()).toBeTruthy();
				expect(stage[0].children.length).toBe(1);
				expect(_g.players.models.length).toBe(4);
				expect(view.subview.el.children.length).toBe(4)
				expect(_g.players.models[3].get('nick')).toBe('cireshescu');


				view.subview.$el.find('a.clicker:eq(0)').click();
				m = MainController.view();
				m.$el.find('input[name=nick]').val('miranda');
				m.$el.find('button.submit').click()

				expect(m.subview.model.isValid()).toBeTruthy();
				expect(_g.players.models[3].get('nick')).toBe('miranda');


				m = null;
			})

			afterEach(function(){
				MainController.remove();
				if(view){
					view.remove();
					view = null;
				}
				_g.players.reset();
			});
		});
	});
}) 