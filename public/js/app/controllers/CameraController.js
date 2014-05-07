define([
	'app/utils/Global'
], function(_g){
	"use strict"
	if (!window.__cc){
		var f = function(){
			var ctrl, cam = null, state = 0, stream,type = _g.cameraType.NONE,
				video, back, button, next, avatar, canvas, prevAvatar,
			_stop = function(){
				if (cam && stream){
					trace('CAM_CTRL:: stop camera');
					state = 0;
					stream.stop();
					stream = null;
				}
			},
			_initERROR = function(){
				Backbone.trigger(_g.events.SHOW_ERROR, _g.errors.CAMERA_STREAM_FAIL);
			},
			
			_getCam = function(){
				if (type != _g.cameraType.NONE && cam != null){
					trace('CAM_CTRL:: camera detected... ');
					if (type === _g.cameraType.WEB){
						navigator.getMedia({video: true, audio: false},_handleNormalCam, _initERROR);
					}else{
						trace('CAM_CTRL:: ---> click the file input');
						$('#webCapture').click();
					}
				}else{
					Backbone.trigger(_g.events.SHOW_ERROR, _g.errors.NO_CAMERA)
				}
			},
			_handleNormalCam = function(_stream){
				trace('CAM_CTRL:: stream initialized');
				stream = _stream;

				video = document.querySelector('video.screen');
				back = document.querySelector('.cancelAvatar');
				button = document.querySelector('.newAvatar');
				next = document.querySelector('.saveAvatar');
				avatar = document.querySelector('a.avatar');
				canvas = document.querySelector('.canvas');

				$(button).show();
				$(back).show();
				$(avatar).hide();


				if (navigator.mozGetUserMedia) {
					video.mozSrcObject = stream;
				} else {
					var vendorURL = window.URL || window.webkitURL;
					video.src = vendorURL.createObjectURL(stream);
					vendorURL = null;
				}

				$(button).click(function(e){
						e.preventDefault();
						state = 2;

						canvas.width = video.videoWidth;
						canvas.height = video.videoHeight;
						var ctx = canvas.getContext('2d');
						ctx.drawImage(video,0,0,canvas.width,canvas.height);
						
						prevAvatar = avatar.children[0].src;
						avatar.children[0].src = canvas.toDataURL();

						$(button).hide();
						$(next).show();
					});
				$(back).click(function(e){
					e.preventDefault();
					if (state === 2){
						canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
						canvas.width = canvas.height = 0;
						state = 1;
						avatar.children[0].src = prevAvatar

						$(button).show();
						$(next).hide();
					}else{
						prevAvatar = null;
						_stop()

						$(button).hide();
						$(back).hide();
						$(avatar).show();
					}
				});
				$(next).click(function(e){
					e.preventDefault();
					// save it to the model
					_stop();
					
					$(back).hide();
					$(next).hide();
					$(avatar).show();
				});
			},
			_handlePhoneCam = function(file){
				trace('CAM_CTRL:: received image data from file')
				var url = window.URL || window.webkitURL, img, firstRun = true,
					resetItems = function(){
						$(back).hide();
						$(next).hide();
						$('#webCapture').val('');
						url.revokeObjectURL(img);
						img = null;
					}

				back = document.querySelector('.cancelAvatar');
				next = document.querySelector('.saveAvatar');
				
				avatar = document.querySelector('a.avatar img');
				canvas = document.querySelector('.canvas');
				prevAvatar = avatar.src;


				$(next).click(function(e){
					e.preventDefault();
					resetItems();
				});
				$(back).click(function(e){
					e.preventDefault();
					avatar.src = prevAvatar;
					resetItems()
				})

				try{
					img = url.createObjectURL(file);
					avatar.src = img;
					avatar.onload = function(){
						// prevent cycling on iphone
						if (firstRun){
							trace("CAM_CTRL:: parse image to canvas...");
							firstRun = false;
							canvas.width = avatar.width;
							canvas.height = avatar.height;
							canvas.getContext('2d').drawImage(avatar, 0,0, canvas.width, canvas.height);
							avatar.src = canvas.toDataURL();
						}
					}
					$(back).show();
					$(next).show();
				}catch(e){
					trace('CAM_CTRL:: failed to read taken picture');
				}
			},
			_start = function(mainController){
				if (mainController){
					ctrl = mainController;
				}else{
					Backbone.trigger(_g.events.SHOW_ERROR, _g.errors.CAMERA_CONTROLLER_FAIL);
				}

				cam = _g.isMobile//navigator.camera;
				if (cam){
					type = _g.cameraType.MOBILE
				}else{
					navigator.getMedia = ( navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.getUserMedia );
					cam = navigator.getMedia;
					if (cam){
						type = _g.cameraType.WEB;
					}
				}

				Backbone.on(_g.events.AVATAR_FROM_PHONECAM, _handlePhoneCam)
			},
			_end = function(){
				Backbone.off(_g.events.AVATAR_FROM_PHONECAM)
			}
			return {
				stopCamera: _stop,
				getCamera: _getCam,
				init: _start,
				remove: _end
			}
		}
		window.__cc = new f();
	}
	return window.__cc
});