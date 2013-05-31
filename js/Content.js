/**
	@file Content
	<a href="../category.html">Demo 1</a>
	<a href="../test.html">Demo 2</a>
	@author Daniel Tan
	@example
	// returns an instance of Content class
	var content = new Content("id", [{data:"test1"}, {data:"test2"}])
*/

/** list of event used in {@link Content}
	@property {String} CONTENT_SELECT - triggers when content is selected
	@property {String} CONTENT_SHOW - triggers when content is shown
	@property {String} CONTENT_HIDE - triggers when content is hidden
	@property {String} CONTENT_OVER - triggers when mouse is over the content
	@property {String} CONTENT_OUT - triggers when mouse is out of the content
*/
var ContentEvent = {
	CONTENT_SELECT:"CONTENT_SELECT",
	CONTENT_SHOW:"CONTENT_SHOW",
	CONTENT_HIDE:"CONTENT_HIDE",
	CONTENT_OVER:"CONTENT_OVER",
	CONTENT_OUT:"CONTENT_OUT"
	};


if(window.Dom == null) {
	console.log("Content.js requires Dom.js");
	Require.script("js/Dom.js");
}
if(window.EventDispatcher == null) {
	console.log("Content.js requires EventDispatcher.js");
	Require.script("js/EventDispatcher.js");
}
/**
	@constructor
	@augments EventDispatcher
	@requires Dom 
	
	@param {String} builderID - id of dom container
	@param {Array/String} database - array of object/ url of the file to load
    @param {Boolean} dynamicLoad - set only if the database is external
*/
function Content(builderID, database, dynamicLoad) {
	Content.prototype = EventDispatcher;
	Content.prototype.constructor = Content;
	
	EventDispatcher.apply(this, arguments);
	
	var thisClass = this;
	
	var design = "";
	var list = [];
	var db = [];
	var id = (builderID) ? builderID : "content-item";

    var dynamic = dynamicLoad ? dynamicLoad : false;
    
    var dbURL = "";
	
	var currentSelected = 0;
	var currentActive = 0;
	
	var currentFilter = "";
	
	this.selectEnabled = true;
	
	this.defaultTarget = this;
	this.defaultKey = "data";
	
	this.maxContent = 999;
	
	this.contentTag = "li";
	this.contentTagCon = "ul";
	
	/** set the tag type that will be used
		@param {String} s - type of tag
	*/
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
	/** set the builder id
		@param {String} i - id of the builder
	*/
	this.setBuilderID = function(i) {
		id = i;
	}
	/** get the builder id
		@returns id builder id
	*/
	this.getBuilderID = function() {
		return id;
	}
    this.isDynamic = function() {
        return dynamic;
    }
	/** set the database
		@param {Array} database - database to be used
	*/
	this.setDB = function(database) {
        if(typeof database == "string") {
            dbURL = database;
            Ajaxer.get(dbURL, function(e){
                            db = eval(e);
                       });
        } else {
            db = database;
        }
		
	}
    /** get db
        returns database
    */
    this.getDb = function() {
        return db;
    }
    this.setDB(database);
	/** set the design template
		@param {String} d - design template
	*/
	this.setDesign = function(d) {
		design = d;
	}
	/** get the design template
		@returns design template
	*/
	this.getDesign = function() {
		return design;
	}
	/** get the list
		@returns the list
	*/
	this.getList = function() {
		return list;
	}
	/** get the current data
		@returns the data
	*/
	this.getCurrentData = function() {
		return this.getList()[this.getCurrentSelected()];
	}
	/** get current selected
		@returns the current selected
	*/
	this.getCurrentSelected = function() {
		return currentSelected;
	}
	/** get current active
		@returns the current active
	*/
	this.getCurrentActive = function() {
		return currentActive;
	}
	/** remove data from the database
		@param {Object} itemData - item data to remove
	*/
	this.removeData = function(itemData) {
		db.splice(itemData.id, 1);
	}
	/** add data from the database
		@param {Object} itemData - item data to add
	*/
	this.addData = function(itemData) {
		db.push(itemData);
	}
	/** get an item from the database
		@param {Object} itemData - item to pull from database
		@returns the item
	*/
	this.getData = function(itemData) {
		return db[db.indexOf(itemData)];
	}
	/** use to build content
		@param {Object} data - from the database
		@param {String} design - set design
		@returns the content
		
		@protected
	*/
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
	/** get data from the database using filter keys
		@param {String} filter - the string to be filtered
		@param {String} key - the key from the database
		@param {Object} tempDB - temporary database to use
		
		@returns the filtered database
	*/
	this.filter = function(filter, key, tempDB) {
		currentFilter = filter;
		currentSelected = 0;
		currentActive = 0;
		
		tempDB = tempDB ? tempDB: db;

		var dbLength = tempDB.length;
		var ctr = 0;
		list = [];
		for(var i = 0; i < dbLength; ++i){
			tempDB[i].id = i;
					
			if(currentFilter) {
				if(!key)
					key = this.defaultKey;
				var data = String(tempDB[i][key]);
				var regEx = new RegExp(currentFilter, "i");

				if(data.search(regEx) >= 0) {
					list.push(tempDB[i]);
				}
			}else {
				list.push(tempDB[i]);
			}
			if(list.length >= this.maxContent)
				break;
		}
		return list;
	}
    /** get filtered html content
		@param {String} filter - the string to be filtered
		@param {String} key - the key from the database
		@param {Function} onFilterCallBack - callback
	*/
    this.getExternalContent = function(filter, key, onFilterCallBack) {
        Ajaxer.get(dbURL + "?" + key + "=" + filter, function(e){
                console.log(thisClass.getContent(filter, key, eval(e)));
                onFilterCallBack(thisClass.getContent(filter, key, eval(e)));
            });
    }
	/** get filtered html content
		@param {String} filter - the string to be filtered
		@param {String} key - the key from the database
		@param {Object} tempDB - temporary database to use
		
		@returns the filtered html content
	*/
	this.getContent = function(filter, key, tempDB) {
		currentFilter = filter;
		currentSelected = 0;
		currentActive = 0;
		
		tempDB = tempDB ? tempDB: db;
        db = tempDB;
        
		var contents = "<" + this.contentTagCon + " id='" + id + "' class='content-items'>";
		
		var dbLength = tempDB.length;
		var ctr = 0;
		list = [];
		
		var isFound;
		for(var i = 0; i < dbLength; ++i){
			tempDB[i].id = i;

			isFound = false;
			if(currentFilter) {
				if(!key)
					key = this.defaultKey;
				var data = String(tempDB[i][key]);
				var regEx = new RegExp(currentFilter, "i");
				
				if(data.search(regEx) >= 0) {
					isFound = true;
				}
			}else {
				
				isFound = true;
			}
			
			if(isFound) {
				list.push(tempDB[i]);
				
				var item = Dom.create(this.contentTag, id + "-" + (list.length - 1));
				Dom.addClass(item, "content-item");
				Dom.addClass(item, id);
				item.innerHTML = this.buildContent(tempDB[i], this.getDesign());
				
				var temp = Dom.create(Dom.type.DIV);
				temp.appendChild(item);
				
				
				contents += temp.innerHTML;
			}
			
			if(list.length >= this.maxContent)
				break;
		}
		if(this.selectEnabled && list.length > 0)
			this.addLiveListener(id + "-" + (list.length - 1), function(){ thisClass.setSelectable(); });
		
		return contents += "</"+ this.contentTagCon +">";	
	}
	/** set the items to selectable
		
	*/
	this.setSelectable = function() {
		var listLength = list.length;
		for(var i = 0; i < listLength; ++i) {
			var target = Dom.el(id + "-" + i);
			if(target) {
				target.onclick = function(key) { return function() { thisClass.onItemClick(key); } }(i);
				target.onmouseover = function(key) { return function() { thisClass.onItemOver(key); } }(i);
				target.onmouseout = function(key) { return function() { thisClass.onItemOut(key); } }(i);
			}
			
		}
	}
	/** called when an item is clicked
		@param {int} key - the id
		@protected
	*/
	this.onItemClick = function(key) {
		this.selectContent(key);
		this.dispatchEvent(ContentEvent.CONTENT_SELECT, list[currentSelected]);
	}
	/** select the content
		@param {int} id - the id
	*/
	this.selectContent = function(id) {
		this.deSelect(currentSelected);
		currentSelected = id;
		this.selectByID(currentSelected);
	}
	/** de select the the content using its id
		@param {String} id - the ids
	*/
	this.deSelect = function(dataID) {
		var target = Dom.el(id + "-" + dataID);
		if(target)
			Dom.removeClass(target, "selected");
	}
	/** select item by id
		@param {String} dataID - item id
	*/
	this.selectByID = function(dataID) {
		var target = Dom.el(id + "-" + dataID);
		if(target)
			Dom.addClass(target, "selected");
	}
	/** called when mouse i out
		@param {int} key - the id
		@protected
	*/
	this.onItemOut = function(key) {
		this.deActivate(key);
		currentActive = 0;
		this.dispatchEvent(ContentEvent.CONTENT_OUT, list[currentActive]);
	}
	/** called when mouse is over
		@param {int} key - the id
		@protected
	*/
	this.onItemOver = function(key) {
		this.activeContent(key);
		this.dispatchEvent(ContentEvent.CONTENT_OVER, list[currentActive]);
	}
	/** set the content to active
		@param {int} id - item id
	*/
	this.activeContent = function(id) {
		this.deActivate(currentActive);
		currentActive = id;
		this.activeByID(currentActive);
	}
	/** remove the active state
		@param {int} dataID - item id
	*/
	this.deActivate = function(dataID) {
		var target = Dom.el(id + "-" + dataID);
		if(target)
			Dom.removeClass(target,"active");
	}
	/** set the content to active by id
		@param {String} dataID - item id
		@protected
	*/
	this.activeByID = function(dataID) {
		var target = Dom.el(id + "-" + dataID);
		if(target)
			Dom.addClass(target, "active");
	}
	/** show the content
		
	*/
	this.showContent = function() {
		this.addLiveListener(id, function(){
				Dom.el(id).style.display = "block";
				thisClass.dispatchEvent(ContentEvent.CONTENT_SHOW, list);
			});
		
	}
	/** hide the content
	
	*/
	this.hideContent = function() {
		this.addLiveListener(id, function(){
				Dom.el(id).style.display = "none";
				thisClass.dispatchEvent(ContentEvent.CONTENT_HIDE, list);
			});
	}
}


