

function Nu() {
	
	var thisClass = this;
	this.isIE = (navigator.appName == 'Microsoft Internet Explorer') ? true: false;
	this.defaultTarget = window;
	this.listeners = [];
	
	this.liveListener = [];
	this.eventInterval;
	
	this.mouse = function(e){
		var mouse = new Object();
		if (!this.isIE) {
			mouse.x = e.pageX;
			mouse.y = e.pageY;
		}else{
			mouse.x = event.x;
			mouse.y = event.y;
		}
		return mouse;
	}
	this.addLiveListener = function(id, func) {
		this.liveListener.push({id:id, func:func});
		if(this.liveListener.length > 0)
			this.eventInterval = setInterval(function(){ thisClass.checkLive() }, 50);
	}
	this.checkLive = function() {
		for(var i = 0; i < this.liveListener.length; ++i) {
			var live = this.liveListener[i];
			console.log(document.getElementById(live.id));
			if(document.getElementById(live.id)) {
				live.func();
				this.removeLiveListener(live);
			}
		}
	}
	this.removeLiveListener = function(live) {
		var index = this.liveListener.indexOf(live);
		this.liveListener.splice(index, 1);
		if(this.liveListener.length <= 0)
			clearInterval(this.eventInterval);
	}
	this.addClass = function(target, className) {
		target.setAttribute("class", target.className + " " + className);
		target.setAttribute("className", target.className + " " + className);
	}
	this.removeClass = function(target, className) {
		var regEx = new RegExp(className, "i");
		target.className = target.className.replace(regEx, "");
	}
	this.keyCode = function(e) {
		return (e != undefined) ? e.keyCode : window.event.keyCode;
	}
	this.dispatchEvent = function(type, e){
		if(!(this.listeners[type] instanceof Array))
			return;
		var listenersCount = this.listeners[type].length
		for(var i = 0; i < listenersCount; i++)
			this.listeners[type][i](e);
	}
	this.addListener = function(type, listener, target){
		if(!(this.listeners[type] instanceof Array))
			this.listeners[type] = [];
		this.listeners[type].push(listener);
		var t = (target != null) ? target : this.defaultTarget;
		t[type] = function(e){
			this.dispatchEvent(type, e);
			};
			
	}
	this.removeListener = function(type, listener, target){
		var index = this.listeners[type].indexOf(listener);
		this.listeners[type].splice(index, 1);
	}
	this.objectToString = function(o) {
		var parse = function(_o){
		    var a = [], t;
		    for(var p in _o){
			if(_o.hasOwnProperty(p)){
			    t = _o[p];
			    if(t && typeof t == "object"){
				a[a.length]= p + ":{ " + arguments.callee(t).join(", ") + "}";
			    }
			    else {
				if(typeof t == "string"){
				    a[a.length] = [ p+ ": '" + t.toString() + "'" ];
				}
				else{
				    a[a.length] = [ p+ ": " + t.toString()];
				}
			    }
			}
		    }
		    return a;
		}
		return "{" + parse(o).join(", ") + "}";
	}
	
}
// if Array.prototype.indexOf is not supported
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf=function(o,i){for(var j=this.length,i=i<0?i+j<0?0:i+j:i||0;i<j&&this[i]!==o;i++);return j<=i?-1:i}
}

