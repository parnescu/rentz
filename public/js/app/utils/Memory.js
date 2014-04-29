define(function(){
	"use strict"
	if (!window.__rgm){
		var ctx, f = function(){
			this.notInited = true;
			this.userData = null;
			ctx = this;
			
			this.init = function(){
				if(window.localStorage){
					var _w = localStorage.getItem('rentzUser');

					if (_w){
						this.userData = JSON.parse(_w);
					}else{
						this.userData = {
							nick: null,
							pass: null,
							id: null
						};
					}
					ctx.saveItem('rentzUser', this.userData)
					_w = null;
				}
				this.notInited = false;
			}
			this.saveItem = function(key, value){
				if(window.localStorage){
					trace("MEMORY:: saved '"+key+"'");
					localStorage.setItem(key, JSON.stringify(value));
				}
			}
			return {
				init: this.init,
				getUser: this.getUser,
				saveUser: this.saveUser,
				removeUser: this.removeUser
			}
		}
		f.prototype.getUser = function(){
			if (window.localStorage){
				this.userData = JSON.parse(localStorage.getItem('rentzUser'));
				return this.userData;
			}
			return this.userData;
		}
		f.prototype.saveUser = function(data){
			if (data && data.nick && data.pass && data.id){			
				ctx.saveItem('rentzUser', data);
			}
		}
		f.prototype.removeUser = function(){
			if(window.localStorage){
				localStorage.removeItem('rentzUser');	
			}
		}
		window.__rgm = new f();
	}
	return window.__rgm
})