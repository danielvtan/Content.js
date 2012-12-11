if(window.Nu == null)
	throw "Content Class requires Nu.js";
Content.prototype = new Nu();
Content.prototype.constructor = Content;
function Content(builderID) {
	var thisClass = this;
	var design = "";
	var list = [];
	var db = [];
	var id = (builderID) ? builderID : "list-item";
	
	var currentSelected = 0;
	var currentHovered = 0;
	
	var currentFilter = "";
	
	this.selectEnabled = true;
	
	this.defaultTarget = this;
	
	this.maxContent = 999;
	
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
		
		var contents = "<ul id='" + id + "' class='list-items'>";
		
		var dbLength = db.length;
		var ctr = 0;
		list = [];
		for(var i = 0; i < dbLength; ++i){
			db[i].id = i;
					
			if(currentFilter) {
				if(!key)
					key = "data";
				var data = String(db[i][key]);
				var regEx = new RegExp(currentFilter, "i");
				if(data.search(regEx) >= 0) {
					list.push(db[i]);
					contents += "<li id='"+ id + "-" + (list.length -1)  + "' class='list-item  " + id + "'>" + this.buildContent(db[i], this.getDesign()) + "</li>";
				
				}
			}else {
				list.push(db[i]);
				contents += "<li id='"+ id + "-" + (list.length -1)  + "' class='list-item  " + id + "'>" + this.buildContent(db[i], this.getDesign()) + "</li>";
				
			}
			
			if(list.length >= this.maxContent)
				break;
		}
		if(this.selectEnabled && list.length > 0)
			this.addLiveListener(id + "-" + (list.length - 1), function(){ thisClass.setSelectable(); });
		
		return contents += "</ul>";	
	}
	this.setSelectable = function() {
		var listLength = list.length;
		for(var i = 0; i < listLength; ++i) {
			var target = document.getElementById(id + "-" + i);
			target.onclick = function(key) { return function() { thisClass.onItemClick(key); } }(i);
			target.onmouseover = function(key) { return function() { thisClass.onHoverContent(key); } }(i);
		}
	}
	this.onItemClick = function(key) {
		this.selectContent(key);
		this.onSelectContent();
	}
	this.selectContent = function(id) {
		this.deSelect(currentSelected);
		currentSelected = id;
		this.selectByID(currentSelected);	
	}
	this.onSelectContent = function() {
		this.dispatchEvent(ContentEvent.CONTENT_SELECT, list[currentSelected]);
	}
	this.selectByID = function(dataID) {
		var target = document.getElementById(id + "-" + dataID);
		this.addClass(target, "selected");
	}
	this.deSelect = function(dataID) {
		var prevTarget = document.getElementById(id + "-" + dataID);
		this.removeClass(prevTarget, "selected")
	}
	this.onHoverContent = function(id) {
		this.unHover(currentHovered);
		currentHovered = id;
		this.hoverByID(currentHovered);
		
		this.dispatchEvent(ContentEvent.CONTENT_OVER, list[currentHovered]);
	}
	this.unHover = function(dataID) {
		var target = document.getElementById(id + "-" + dataID);
		this.removeClass(target,"active");
	}
	this.hoverByID = function(dataID) {
		var target = document.getElementById(id + "-" + dataID);
		this.addClass(target, "active");
	}
	
	this.showContent = function() {
		var content = document.getElementById(id);
		content.style.display = "block";
	}
	this.hideContent = function() {
		var content = document.getElementById(id);
		content.style.display = "none";
	}
}

var ContentEvent = {
		CONTENT_SELECT:"CONTENT_SELECT",
		CONTENT_SHOW:"CONTENT_SHOW",
		CONTENT_HIDE:"CONTENT_HIDE",
		CONTENT_OVER:"CONTENT_OVER"
		};

