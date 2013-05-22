/**
	@file AutoComplete
	<a href="../autocomplete.html">Demo 1</a>
	<a href="../autocomplete-fb.html">Demo 2</a>
	<a href="../autocomplete-fb2.html">Demo 3</a>
	<a href="../autocomplete.html">Demo 4</a>
	<a href="../test.html">Demo 5</a>
	@author Daniel Tan
	@example
	// returns an instance of AutoComplete class
	var auto = new AutoComplete("autoCon", friendDB);
*/


if(window.Content == null) {
	console.log("AutoComplete.js requires Content.js");
	Require.script("js/Content.js");
}
/** 
	@constructor
	@augments Content
	@param {string} containerID - id of dom container
	@param {object} database - object of data
	
	
*/
function AutoComplete(containerID, database) {
	AutoComplete.prototype = Content;
	AutoComplete.prototype.constructor = AutoComplete;
	
	Content.apply(this, arguments);
	
	var thisClass = this;
	var con = Dom.el(containerID);
	
	var autoInput;
	var autoContent;
	if(con.tagName == Dom.type.INPUT) {
		autoContent = Dom.create(Dom.type.DIV, containerID + "ContentCon");
		autoInput = con;
		autoInput.id = containerID + "Input";
		
		var parent = autoInput.parentNode;
		parent.replaceChild(Dom.create(Dom.type.DIV, containerID), autoInput);
		Dom.el(containerID).appendChild(autoInput);
		
		Dom.el(containerID).appendChild(autoContent)

		
	} else {
		autoInput = Dom.create(Dom.type.INPUT, containerID + "Input");
		con.appendChild(autoInput);
		
		autoContent = Dom.create(Dom.type.DIV, containerID + "ContentCon");
		con.appendChild(autoContent);
		
	}
	Dom.addClass(autoInput, "auto-input");
	autoInput.name = containerID;
	autoInput.autocomplete = "off";
	autoInput.type = "text";
	
	Dom.addClass(autoContent, "content-con");
	autoContent.style.display = "none";
	
	this.setDesign('<span>${data}</span>');
	this.setBuilderID(containerID + "Content");
	this.show = function(x, y) {
		thisClass.showContent();
		autoContent.innerHTML = thisClass.getContent();
		thisClass.activeContent(0);
		if(x != null)
			con.style.left = x + "px";
		if(y != null)
			con.style.top = y + "px";
	}
	
	this.autoHide = true;
	this.autoFill = true;
	this.autoSetOver = false;
	
	/** hides the autocontent dom element
	*/
	this.hide = function() {
		thisClass.hideContent();
		autoContent.style.display = "none";
	}
	/** clears the input field
		
	*/
	this.clear = function() {
		thisClass.getInput().value = "";
	}
	/** get the input field
		@returns the input field
	*/
	this.getInput = function() {
		return autoInput;
	}
	/** force reload the content displayed
	
	*/
	this.reload = function() {
		autoContent.innerHTML = thisClass.getContent(autoInput.value);
		thisClass.activeContent(0);
	}
	thisClass.addListener(ContentEvent.CONTENT_SHOW, function(e) {
		autoContent.style.display = "block";
	});
	
	thisClass.addListener(ContentEvent.CONTENT_SELECT, function(e) {
		if(thisClass.autoHide) {
			thisClass.hide();
		}
		if(thisClass.autoFill)
			thisClass.getInput().value = e.data;
	});
	thisClass.addListener(ContentEvent.CONTENT_OVER, function(e) {
		if(thisClass.autoSetOver)
			thisClass.getInput().value = e.data;
	});
	autoInput.onfocus = function(e){
		thisClass.show();
		};
	autoInput.onblur = function(e){
		setTimeout(function(){
			 thisClass.hide();
		}, 150);
	}
	autoInput.onkeydown = function(e) {
		var code = thisClass.keyCode(e);
		switch(code) {
			case 9:
				 // tab
				thisClass.hideContent();
			break;
			case 13:
				 // enter
				thisClass.selectContent(thisClass.getCurrentActive());
				thisClass.dispatchEvent(ContentEvent.CONTENT_SELECT, thisClass.getList()[thisClass.getCurrentActive()]);
				window.event.returnValue = false;
				e.preventDefault();
			break;
			case 40:
				// arrow down
				if(thisClass.getCurrentActive() >= thisClass.getList().length - 1)
					thisClass.activeContent(0);
				else
					thisClass.activeContent(thisClass.getCurrentActive() + 1);
			break;
			case 38:
				// arrow up
				if(thisClass.getCurrentActive() <= 0)
					thisClass.activeContent(thisClass.getList().length - 1);
				else
					thisClass.activeContent(thisClass.getCurrentActive() - 1);
			break;
			default:
				// nay other key
			break;
		}
	}
	autoInput.onkeyup = function(e) {
		var code = thisClass.keyCode(e);
		switch(code) {
			case 9:
				 // tab
			break;
			case 13:
				 // enter
				window.event.returnValue = false;
				e.preventDefault();
			break;
			case 40:
				// arrow down
				
			break;
			case 38:
				// arrow up
			   
			break;
			default:
				// nay other key
				thisClass.show();
				autoContent.innerHTML = thisClass.getContent(autoInput.value);
				thisClass.activeContent(0);
			break;
		}
	}
	
}