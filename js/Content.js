if(window.Dom == null) {
	console.log("Content.js requires Dom.js");
	Require.script("js/Dom.js");
}
if(window.EventDispatcher == null) {
	console.log("Content.js requires EventDispatcher.js");
	Require.script("js/EventDispatcher.js");
}
/** Class: Content
	creates a new instance Content. Extends <EventDispatcher>
    (start code)
	// returns an instance of Content class
	var content = new Content("id", [{data:"test1"}, {data:"test2"}])
    
    // to extend add this in inside your class
	YourClass.prototype = Content;
	YourClass.prototype.constructor = YourClass;
	Content.apply(this, arguments);
    
    (end)
    
    Parameters:
	builderID - *[string]* id of dom container
	database - *[array] optional* array of object/ url of the file to load
    dynamicLoad  - *[string] optional* set only if the database is external
	
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
	
	/** Function: setTagType
        set the tag type that will be used
		
        Parameters:
        s - type of tag
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
	/** Function: setBuilderID
        set the builder id
		
        Parameters:
        i - id of the builder
	*/
	this.setBuilderID = function(i) {
		id = i;
	}
	/** Function: getBuilderID
        get the builder id
		Returns:
        id builder id
	*/
	this.getBuilderID = function() {
		return id;
	}
    /** Function: isDynamic
        check if database is externally loaded
        
        Returns:
        Boolean
    */
    this.isDynamic = function() {
        return dynamic;
    }
	/** Function: setDB
        set the database
		Parameters:
        database - database to be used
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
    /** Function: getDb
    
        Returns:
        database
    */
    this.getDb = function() {
        return db;
    }
    this.setDB(database);
	/** Function: setDesign
        set the design template
		
        Parameters:
        d - design template
	*/
	this.setDesign = function(d) {
		design = d;
	}
	/** Function: getDesign
        get the design template
		
        Returns:
        design template
	*/
	this.getDesign = function() {
		return design;
	}
	/** Function: getList
        get the list
		
        Returns:
        the list
	*/
	this.getList = function() {
		return list;
	}
	/** Function: getCurrentData
        get the current data
		
        Returns:
        the data
	*/
	this.getCurrentData = function() {
		return this.getList()[this.getCurrentSelected()];
	}
	/** Function: getCurrentSelected
        get current selected
		
        Returns:
        the current selected
	*/
	this.getCurrentSelected = function() {
		return currentSelected;
	}
	/** Function: getCurrentActive
        get current active
		
        Returns:
        the current active
	*/
	this.getCurrentActive = function() {
		return currentActive;
	}
	/** Function: removeData
        remove data from the database
		
        Parameters:
        itemData - item data to remove
	*/
	this.removeData = function(itemData) {
		db.splice(itemData.id, 1);
	}
	/** Function: addData
        add data from the database
		
        Parameters:
        itemData - item data to add
	*/
	this.addData = function(itemData) {
		db.push(itemData);
	}
	/** Function: getData
        get an item from the database
		
        Parameters:
        itemData - item to pull from database
		
        Returns:
        the item
	*/
	this.getData = function(itemData) {
		return db[db.indexOf(itemData)];
	}
	/** Function: buildContent
        use to build content
		
        Parameters:
        data - from the database
		design - set design
		
        Returns:
        the content
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
	/** Function: filter
        get data from the database using filter keys
		
        Paramters:
        filter - the string to be filtered
		key - the key from the database
		tempDB - temporary database to use
		
        Returns:
		the filtered database
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
    /** Function: getExternalContent
        get filtered html content
		
        Parameters:
        filter - the string to be filtered
		key - the key from the database
		onFilterCallBack - callback
	*/
    this.getExternalContent = function(filter, key, onFilterCallBack) {
        Ajaxer.get(dbURL + "?" + key + "=" + filter, function(e){
                onFilterCallBack(thisClass.getContent(filter, key, eval(e)));
            });
    }
	/** Function: getContent
        get filtered html content
		
        Parameters:
        filter - the string to be filtered
		key - the key from the database
		tempDB - temporary database to use
		
		Returns:
        the filtered html content
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
	/** Function: setSelectable
        set the items to selectable
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
	/** Function: onItemClick
        called when an item is clicked
		
        Parameters:
        key - the id
	*/
	this.onItemClick = function(key) {
		this.selectContent(key);
		this.dispatchEvent(ContentEvent.CONTENT_SELECT, list[currentSelected]);
	}
	/** Function: selectContent
        select the content
		
        Parameters:
        id - the id
	*/
	this.selectContent = function(id) {
		this.deSelect(currentSelected);
		currentSelected = id;
		this.selectByID(currentSelected);
	}
	/** Function: deSelect
        de select the the content using its id
		
        Parameters:
        id - the ids
	*/
	this.deSelect = function(dataID) {
		var target = Dom.el(id + "-" + dataID);
		if(target)
			Dom.removeClass(target, "selected");
	}
	/** Function: selectByID
        select item by id
		
        Parameters:
        dataID - item id
	*/
	this.selectByID = function(dataID) {
		var target = Dom.el(id + "-" + dataID);
		if(target)
			Dom.addClass(target, "selected");
	}
	/** Function: onItemOut
        called when mouse i out
		
        Parameters:
        key - the id
	*/
	this.onItemOut = function(key) {
		this.deActivate(key);
		currentActive = 0;
		this.dispatchEvent(ContentEvent.CONTENT_OUT, list[currentActive]);
	}
	/** Function: onItemOver
        called when mouse is over
		
        Parameters:
        key - the id
	*/
	this.onItemOver = function(key) {
		this.activeContent(key);
		this.dispatchEvent(ContentEvent.CONTENT_OVER, list[currentActive]);
	}
	/** Function: activeContent
        set the content to active
		
        Parameters:
        id - item id
	*/
	this.activeContent = function(id) {
		this.deActivate(currentActive);
		currentActive = id;
		this.activeByID(currentActive);
	}
	/** Function: deActivate
        remove the active state
		
        Parameters:
        dataID - item id
	*/
	this.deActivate = function(dataID) {
		var target = Dom.el(id + "-" + dataID);
		if(target)
			Dom.removeClass(target,"active");
	}
	/** Function: activeByID
        set the content to active by id
		
        Parameters:
        dataID - item id
	*/
	this.activeByID = function(dataID) {
		var target = Dom.el(id + "-" + dataID);
		if(target)
			Dom.addClass(target, "active");
	}
	/** Function: showContent
        show the content
	*/
	this.showContent = function() {
		this.addLiveListener(id, function(){
				Dom.el(id).style.display = "block";
				thisClass.dispatchEvent(ContentEvent.CONTENT_SHOW, list);
			});
		
	}
	/** Function: hideContent
        hide the content
	*/
	this.hideContent = function() {
		this.addLiveListener(id, function(){
				Dom.el(id).style.display = "none";
				thisClass.dispatchEvent(ContentEvent.CONTENT_HIDE, list);
			});
	}
}

/** Event: ContentEvent
	CONTENT_SELECT - triggers when content is selected
	CONTENT_SHOW - triggers when content is shown
	CONTENT_HIDE - triggers when content is hidden
	CONTENT_OVER - triggers when mouse is over the content
	CONTENT_OUT - triggers when mouse is out of the content
    
    (start code)
        ContentEvent.CONTENT_SELECT
    (end)
*/
var ContentEvent = {
	CONTENT_SELECT:"CONTENT_SELECT",
	CONTENT_SHOW:"CONTENT_SHOW",
	CONTENT_HIDE:"CONTENT_HIDE",
	CONTENT_OVER:"CONTENT_OVER",
	CONTENT_OUT:"CONTENT_OUT"
	};

