module.exports = (function(){
	trace("CONFIG:: -> environment mode: "+process.env.NODE_ENV)
	return {
		db: {
			dev: {
				host: 'localhost',
				port: null,
				db: 'rentz'

			}
			,production:{
				host: "parnescu:adrian@dbh42.mongolab.com",
				port: 27427,
				db: "showcase"
			}
		}
		,devMode: process.env.NODE_ENV == 'development' ? true : false
		,port: process.env.PORT || 3000
	}
})();