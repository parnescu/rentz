(function(){
	'use strict';
	require.config({
		paths: {
			'jasmine': '/jasmine/lib/jasmine-core/jasmine',
			'jasmine-html': '/jasmine/lib/jasmine-core/jasmine-html',
			'boot': '/jasmine/lib/jasmine-core/boot'
		}
		,shim:{
			'jasmine': {
				exports: 'jasmine'
			},
			'jasmine-html':{
				deps: ['jasmine'],
				exports: 'jasmine'
			},
			'boot':{
				deps: ['jasmine','jasmine-html'],
				exports: 'jasmine'
			}
		}
	});
	var specs = ['/js/tests/specfile.js'];

	requirejs(['boot'], function(){
		requirejs(specs, function(){
			window.onload();
		});
	});
})()
