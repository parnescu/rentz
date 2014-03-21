express = require('express');
var config = require('./config.js'),
	app = express();

// setup app config
require('./appsetup.js')(app, config.devMode ? config.db.dev : config.db.production);

// boot up the server
app.listen(process.env.PORT || config.port);
console.log("SERVER:: inited");