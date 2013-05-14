
function EventDispatcher() {
	
	var thisClass = this;
	this.isIE = (navigator.appName == 'Microsoft Internet Explorer') ? true: false;
	this.defaultTarget = window;
	this.listeners = {};
	this.liveListener = [];
    
	this.eventInterval;
    
	this.mouse = function(e){
		var mouse = new Object();
		
		if(e){
			if(e.custom){
				mouse.x = e.x;
				mouse.y = e.y;
				return mouse;
			}else if (e.changedTouches) { 	// iPhone
				mouse.x = e.changedTouches[0].clientX;
				mouse.y = e.changedTouches[0].clientY;
				//e.preventDefault();
				return mouse;
			}else if (e.clientX) { 	// all others
				mouse.x = e.clientX;
				mouse.y = e.clientY;
				//e.preventDefault();
				return mouse;
			}
		}
		if (!thisClass.isIE) {
			mouse.x = e.pageX;
			mouse.y = e.pageY;
			//e.preventDefault();
		}else{
			mouse.x = event.x;
			mouse.y = event.y;
			//event.returnValue = false;
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
			if(Dom.el(live.id)) {
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
	this.keyCode = function(e) {
		return (e != undefined) ? e.keyCode : window.event.keyCode;
	}
	this.dispatchEvent = function(type, e){
		if(this.listeners[type] == undefined)
            return;
        
		for(var i = 0; i < this.listeners[type].length; ++i) {
            this.listeners[type][i](e);
        }
	}
	this.addListener = function(type, listener, target){
        if(this.listeners[type] == undefined) 
            this.listeners[type] = [];
        this.listeners[type].push(listener);
        
		var t = (target != null) ? target : this.defaultTarget;
        if(t[type] == undefined)
            return;
		t[type] = function(e){
            if(t != thisClass.defaultTarget)
                t.dispatchEvent(type, e);
            else
                thisClass.dispatchEvent(type, e);
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
var NuEvent = {
            LOAD:"onload"

            };
