module.exports = function(){
	_default = function(req,res,next,template){
		res.render(template)
	}
	_index = function(req,res,next){
		_default(req,res,next, 'layout')
	}
	_tester = function(req,res,next){
		_default(req,res,next, 'testing')
	}

	return {
		index: _index
		,testing: _tester
	}
}