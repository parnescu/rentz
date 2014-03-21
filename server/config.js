module.exports = (function(){
	return {
		db: {
			dev: {
				host: 'localhost',
				port: null,
				db: 'rentz'

			}
			,production:{
				host: '',
				port: '',
				db: ''
			}
		}
		,devMode: true
		,port: 3000
	}
})();