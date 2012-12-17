if(window.Nu == null)
	throw "Content Class requires Nu.js";
Content.prototype = new Nu();
Content.prototype.constructor = Content;
function Content(builderID) {
	this.super();
	
	var elem = this.elem;
	var thisClass = this;
	var design = "";
	var list = [];
	var db = [];
	var id = (builderID) ? builderID : "content-item";
	
	
	var currentSelected = 0;
	var currentActive = 0;
	
	var currentFilter = "";
	
	this.selectEnabled = true;
	
	this.defaultTarget = this;
	this.defaultKey = "data";
	
	this.maxContent = 999;
	
	this.contentTag = "li";
	this.contentTagCon = "ul";
	
	this.setTagType = function(s) {
		switch(s){
			case "div":
				this.contentTag = "div";
				this.contentTagCon = "div";
			break;
			default:
			break;
		}
	}
	this.setBuilderID = function(i) {
		id = i;
	}
	this.setDB = function(database) {
		db = database;
	}
	this.setDesign = function(d) {
		design = d;
	}
	this.getDesign = function() {
		return design;
	}
	this.getList = function() {
		return list;
	}
	this.getCurrentSelected = function() {
		return currentSelected;
	}
	this.getCurrentActive = function() {
		return currentActive;
	}
	this.removeData = function(itemData) {
		db.splice(itemData.id, 1);
	}
	this.addData = function(itemData) {
		db.push(itemData);
	}
	this.buildContent = function(data, design) {
		var currentItem = design;
	
		for(var prop in data) {
			var regEx = new RegExp("\\${" + prop + "}", "g");
			currentItem = currentItem.replace(regEx, data[prop]);
		}
		var regEx = new RegExp("\\${this}", "g");
		currentItem = currentItem.replace(regEx, this.objectToString(data));
			
		return currentItem;
	}
	this.getContent = function(filter, key) {
		currentFilter = filter;
		currentSelected = 0;
		currentActive = 0;
		
		var contents = "<" + this.contentTagCon + " id='" + id + "' class='content-items'>";
		
		var dbLength = db.length;
		var ctr = 0;
		list = [];
		for(var i = 0; i < dbLength; ++i){
			db[i].id = i;
					
			if(currentFilter) {
				if(!key)
					key = this.defaultKey;
				var data = String(db[i][key]);
				
				var regEx = new RegExp(currentFilter, "i");
				if(data.search(regEx) >= 0) {
					list.push(db[i]);
					contents += "<"+ this.contentTag +" id='"+ id + "-" + (list.length -1)  + "' class='content-item  " + id + "'>" + this.buildContent(db[i], this.getDesign()) + "</"+ this.contentTag +">";
				
				}
			}else {
				list.push(db[i]);
				contents += "<"+ this.contentTag +" id='"+ id + "-" + (list.length -1)  + "' class='content-item  " + id + "'>" + this.buildContent(db[i], this.getDesign()) + "</"+ this.contentTag +">";
				
			}
			
			if(list.length >= this.maxContent)
				break;
		}
		if(this.selectEnabled && list.length > 0)
			this.addLiveListener(id + "-" + (list.length - 1), function(){ thisClass.setSelectable(); });
		
		return contents += "</"+ this.contentTagCon +">";	
	}
	this.setSelectable = function() {
		var listLength = list.length;
		for(var i = 0; i < listLength; ++i) {
			var target = elem(id + "-" + i);
			if(target) {
				target.onclick = function(key) { return function() { thisClass.onItemClick(key); } }(i);
				target.onmouseover = function(key) { return function() { thisClass.activeContent(key); } }(i);
			}
			
		}
	}
	this.unSetSelectable = function() {
		this.activeContent = function(){};
		this.deActivate = function(){};
		this.selectContent = function(){};
		this.deSelect = function(){};
	}
	this.onItemClick = function(key) {
		this.selectContent(key);
	}
	this.selectContent = function(id) {
		if(!this.selectEnabled)
			return;
		this.deSelect(currentSelected);
		currentSelected = id;
		this.selectByID(currentSelected);
		
		
		this.dispatchEvent(ContentEvent.CONTENT_SELECT, list[currentSelected]);
	}
	this.deSelect = function(dataID) {
		if(!this.selectEnabled)
			return;
		var target = elem(id + "-" + dataID);
		if(target)
			this.removeClass(target, "selected");
	}
	this.selectByID = function(dataID) {
		var target = elem(id + "-" + dataID);
		if(target)
			this.addClass(target, "selected");
	}
	
	
	this.activeContent = function(id) {
		if(!this.selectEnabled)
			return;
		this.deActivate(currentActive);
		currentActive = id;
		this.activeByID(currentActive);
		
		this.dispatchEvent(ContentEvent.CONTENT_OVER, list[currentActive]);
	}
	this.deActivate = function(dataID) {
		if(!this.selectEnabled)
			return;
		var target = elem(id + "-" + dataID);
		if(target)
			this.removeClass(target,"active");
	}
	this.activeByID = function(dataID) {
		var target = elem(id + "-" + dataID);
		if(target)
			this.addClass(target, "active");
	}
	
	
	this.showContent = function() {
		this.addLiveListener(id, function(){
				elem(id).style.display = "block";
				thisClass.dispatchEvent(ContentEvent.CONTENT_SHOW, list);
			});
		
	}
	this.hideContent = function() {
		this.addLiveListener(id, function(){
				elem(id).style.display = "none";
				thisClass.dispatchEvent(ContentEvent.CONTENT_HIDE, list);
			});
	}
}

var ContentEvent = {
	CONTENT_SELECT:"CONTENT_SELECT",
	CONTENT_SHOW:"CONTENT_SHOW",
	CONTENT_HIDE:"CONTENT_HIDE",
	CONTENT_OVER:"CONTENT_OVER"
	};

