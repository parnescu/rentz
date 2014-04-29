module.exports = function(app, config){
	var path = require('path');
		routes = require("./routes.js")(),
		db = require("./database.js")(config);

	app.configure(function(){
		app.set('view engine', 'jade');
		app.set('views', 'server/views');

		app.use(express.favicon()); 
		app.use(express.logger('dev'));
		app.use(express.static(path.join(__dirname, '../public')));
		app.use(express.static(path.join(__dirname, '../bower_components')));
		app.use(express.bodyParser());
	});

	// api setup
	trace("APP:: init API");
	app.get('/api/players', db.getPlayers);
	app.get('/api/players/:id', db.getPlayers);
	app.post('/api/players',db.savePlayer);
	app.put('/api/players/:id',db.savePlayer);
	app.delete('/api/players/:id',db.deletePlayer);

	app.get('/api/user', db.loginUser);
	


	app.get('/', routes.index);
	app.get('/tests', routes.testing);
	app.get('/example', function(req,res){ res.render('example')});
	app.get('/example/*', function(req,res){ res.render('example')});
//	app.get('*', routes.index);
}