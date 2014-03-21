module.exports = function(app, config){
	var path = require('path');
		routes = require('./routes.js')();

	app.configure(function(){
		app.set('view engine', 'jade');
		app.set('views', 'server/views');

		app.use(express.favicon()); 
		app.use(express.logger('dev'));
		app.use(express.static(path.join(__dirname, '../public')));
		app.use(express.static(path.join(__dirname, '../bower_components')));
		app.use(express.bodyParser());
	})


	app.get('/', routes.index);
	app.get('/tests', routes.testing);
}