
if(window.Nu == null)
	throw "AutoComplete requires Nu.js";
AutoComplete.prototype = new Nu();
AutoComplete.prototype.constructor = AutoComplete;
function AutoComplete(container) {
	var autoHolder;
	var inputField;
	var listHolder;
	var currentSelected = 0;
	var listArray = [];
	var maxContent = 10;
	var db = [];
	var parent = container;
	var itemDesign;
	var thisClass = this;
	
	var isOpen = false;
	
	var thisContent = '<div id="autoHolder" ><input id="autoInput" class="auto-content-input" type="text" autocomplete="off"><div id="listHolder" class="auto-content-holder" /></div>';
	
	init();
	function init() {
		parent.innerHTML = thisContent;
		
		autoHolder = document.getElementById("autoHolder");
		inputField = document.getElementById("autoInput");
		listHolder = document.getElementById("listHolder");
		
		listHolder.onclick = function(e){ 
			if (!e) var e = window.event;
			e.cancelBubble = true;
			if (e.stopPropagation) e.stopPropagation();
		}
		
		inputField.onkeydown = function(e) {
			
			var code = thisClass.keyCode(e);
			switch(code) {
				case 39:
					// arrow left
					return false;
				break;
				case 37:
					// arrow right
					return false;
				break;	
				default:
				break;
			}
		}
		inputField.onkeyup = function(e) {
			if(inputField.value == ""){
				thisClass.hideList();
				return;
			}
			var code = thisClass.keyCode(e);
			switch(code){
				case 40:
					// arrow down
					thisClass.changeSelection(+1);
				break;
				case 38:
					// arrow up
					thisClass.changeSelection(-1);
				break;
				case 13:
					// enter key
					thisClass.selectContent();
				break;
				default:
					// nay other key
					thisClass.showList();
				break;
			}
		}
	}
	this.events = { ITEM_SELECT:"ITEM_SELECT",
					LIST_SHOW:"LIST_SHOW",
					LIST_HIDE:"LIST_HIDE"
		}
	this.maxContent = function(num) {
		maxContent = num;	
	}
	this.getInput = function() {
		return inputField;	
	}
	this.setDB = function(database) {
		db = database;
	}
	this.removeItem = function(itemData) {
		db.splice(itemData.id, 1);
	}
	this.addItem = function(itemData) {
		db.push(itemData);
	}
	this.itemDesign = function(design) {
		itemDesign = design;	
	}
	this.hide = function() {
		autoHolder.style.visibility = "hidden";	
	}
	this.clear = function() {
		inputField.value = "";
	}
	this.show = function(x, y) {
		if(x != null)
			autoHolder.style.left = x + "px";
		if(y != null)
			autoHolder.style.top = y + "px";
		autoHolder.style.visibility = "visible";
		
		thisClass.setFocus();
	}
	this.setFocus = function() {
		inputField.focus();	
	}
	this.isOpen = function() {
		return isOpen;
	}
	this.findContent = function() {
		listArray = [];
		currentSelected = 0;
		
		var contents = "<ul class='auto-content-items'>";
		var dbLength = db.length;
		for(var i = 0; i < dbLength; ++i){
			var data = String(db[i].data);
			db[i].id = i;
			//str.search(/blue/i)
			var regEx = new RegExp(inputField.value, "i");
			
			if(data.search(regEx) >= 0) {
				listArray.push(db[i]);
				//str.replace("Microsoft","W3Schools");
				
				contents += "<li id='auto-content-" + i + "' class='auto-content-item'>" + thisClass.buildItem(db[i], itemDesign) + "</li>";
				
				if(listArray.length >= maxContent)
					break;
			}
		}
		contents += "</ul>";
		
		if(listArray.length > 0) {
			thisClass.createList(contents);
			isOpen = true;
			this.dispatchEvent(thisClass.events.LIST_SHOW);
		}else {
			thisClass.hideList();
		}
	}
	this.onItemClick = function(id) {
		thisClass.chooseContent(id);
		thisClass.selectContent();
		
	}
	this.buildItem = function(data, design){
		var currentItem = design;
		for(var prop in data)
			currentItem = currentItem.replace("${" + prop + "}", data[prop]);
		return currentItem;
	}
	this.showList = function() {
		thisClass.findContent();	
	}
	this.hideList = function() {
		listArray = [];
		currentSelected = 0;
		thisClass.createList("");
		isOpen = false;
		this.dispatchEvent(thisClass.events.LIST_HIDE);
	}
	this.chooseContent = function(id) {
		thisClass.deSelect(currentSelected);
		currentSelected = id;
		thisClass.selectByID(currentSelected);	
	}
	this.selectContent = function() {
		var data = listArray[currentSelected];
		if(data != null){
			inputField.value = data.data;
			this.dispatchEvent(thisClass.events.ITEM_SELECT, data);
		}else
			data = {};
		//thisClass.hideList();
	}
	this.changeSelection = function(dir) {
		
		thisClass.deSelect(currentSelected);
		if(currentSelected <= 0 && dir == -1)
			currentSelected = listArray.length - 1;
		if(currentSelected >= listArray.length - 1)
			currentSelected = 0;
		else
			currentSelected += dir;
		thisClass.selectByID(currentSelected);
		
		//inputField.value = listArray[currentSelected].data;
	}
	this.createList = function(content) {
		listHolder.innerHTML = content;
		
		var listCount = listArray.length;
		for(var i = 0; i < listCount; ++i){
			var target = document.getElementById("auto-content-" + listArray[i].id);
			target.onclick = function(id) { return function() { thisClass.onItemClick(id); } }(i);
			target.onmouseover = function(id) { return function() { thisClass.chooseContent(id); } }(i);
		}
		if(listArray.length > 0 )
			thisClass.selectByID(0);
	}
	this.selectByID = function(id) {
		var target = document.getElementById("auto-content-" + listArray[id].id);
		target.setAttribute("class", "auto-content-item selected");
		target.setAttribute("className", "auto-content-item selected");
	}
	this.deSelect = function(id) {
		var prevTarget = document.getElementById("auto-content-" + listArray[id].id);
		prevTarget.setAttribute("class", "auto-content-item");
		prevTarget.setAttribute("className", "auto-content-item");	
	}
}