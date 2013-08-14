if(window.Content == null) {
	console.log("AutoComplete.js requires Content.js");
	Require.script("js/Content.js");
}
/** Class: AutoComplete
    creates a new instance AutoComplete. Extends <Content>
    
    (start code)
	// returns an instance of AutoComplete class
	var auto = new AutoComplete("autoCon", friendDB);
    (end)
    
    Parameters:
	containerID - *[string]* id of dom container
	database - *[array] optional* array of object/ url of the file to load
    dynamicLoad  - *[string] optional* set only if the database is external
    
    
*/
function AutoComplete(containerID, database, dynamic) {
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
    /**
        variable bool: autoHide
        when set to true content will close when user select an item
    */
	this.autoHide = true;
	this.autoFill = true;
	this.autoSetOver = false;
	
    
    /** Function: show
        show the input field and content
        
        Parameters:
        x - *[int/string] optional* x position
        y - *[int/string] optional* y position
    
    */
	this.show = function(x, y) {
		thisClass.showContent();
		if(thisClass.isDynamic()) {
            thisClass.getExternalContent(autoInput.value, "data", function(e) {
                autoContent.innerHTML = e;
                thisClass.activeContent(0);
            });
        } else {
            autoContent.innerHTML = thisClass.getContent(autoInput.value);
            thisClass.activeContent(0);
        }
		
		if(x != null)
			con.style.left = x + "px";
		if(y != null)
			con.style.top = y + "px";
	}
	
	/** FunctionL hide
        hides the autocontent dom element
	*/
	this.hide = function() {
		thisClass.hideContent();
		autoContent.style.display = "none";
	}
	/** Function: clear
        clears the input field
		
	*/
	this.clear = function() {
		thisClass.getInput().value = "";
	}
	/** Function: getInput
        get the input field
		
        Returns:
        the input field
	*/
	this.getInput = function() {
		return autoInput;
	}
	/** Function: reload
        force reload the content displayed
	
	*/
	this.reload = function() {
		if(thisClass.isDynamic()) {
            thisClass.getExternalContent(autoInput.value, "data", function(e) {
                thisClass.showContent();
                autoContent.innerHTML = e;
                thisClass.activeContent(0);
            });
        } else {
            thisClass.showContent();
            autoContent.innerHTML = thisClass.getContent(autoInput.value);
            thisClass.activeContent(0);
        }
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
    autoInput.onkeyup = function(e) {
        var code = thisClass.keyCode(e);
		switch(code) {
			case 9:
				 // tab
				//thisClass.hideContent();
			break;
			case 13:
				 // enter
				//thisClass.selectContent(thisClass.getCurrentActive());
				//thisClass.dispatchEvent(ContentEvent.CONTENT_SELECT, thisClass.getList()[thisClass.getCurrentActive()]);
				
                //if(e)
               //     e.preventDefault();
                //else
                //    window.event.returnValue = false;
			break;
			case 40:
				// arrow down
				//if(thisClass.getCurrentActive() >= thisClass.getList().length - 1)
				//	thisClass.activeContent(0);
				//else
				//	thisClass.activeContent(thisClass.getCurrentActive() + 1);
			break;
			case 38:
				// arrow up
				//if(thisClass.getCurrentActive() <= 0)
				//	thisClass.activeContent(thisClass.getList().length - 1);
				//else
				//	thisClass.activeContent(thisClass.getCurrentActive() - 1);
			break;
			default:
				// nay other key
                
                if(thisClass.isDynamic()) {
                    thisClass.getExternalContent(autoInput.value, "data", function(e) {
                        thisClass.showContent();
                        autoContent.innerHTML = e;
                        thisClass.activeContent(0);
                    });
                } else {
                    thisClass.showContent();
                    autoContent.innerHTML = thisClass.getContent(autoInput.value);
                    thisClass.activeContent(0);
                }
			break;
		}
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
				
                if(e)
                    e.preventDefault();
                else
                    window.event.returnValue = false;
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
}