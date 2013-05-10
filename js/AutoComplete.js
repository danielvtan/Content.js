if(window.Content == null)
	throw "AutoComplete requires Content.js";
AutoComplete.prototype = Content;
AutoComplete.prototype.constructor = AutoComplete;
function AutoComplete(containerID, database) {
    Content.apply(this, arguments);
    
	var thisClass = this;
   
	var con = Dom.el(containerID);
    Dom.addClass(con, "auto-con");
	con.innerHTML = '<input id="'+ containerID + 'Input" class="auto-input" name="' + containerID + '" type="text" autocomplete="off"><div class="content-con" id="' + containerID + 'ContentCon"></div>';
    
	var autoContent = Dom.el(containerID + "ContentCon");
    autoContent.style.display = "none";
	var autoInput = Dom.el(containerID + "Input");
	
    this.setDB(database);
    this.setDesign('<span>${data}</span>');
	this.setBuilderID(containerID + "Content");
	this.show = showList;
	
	function showList() {
		thisClass.showContent();
		autoContent.innerHTML = thisClass.getContent();
		thisClass.activeContent(0);
	}
	this.getInput = function() {
		return autoInput;
	}
    
    this.autoHide = true;
    this.autoSet = true;
    
    
    thisClass.addListener(ContentEvent.CONTENT_SHOW, function(e) {
        autoContent.style.display = "block";
    });
    thisClass.addListener(ContentEvent.CONTENT_SELECT, function(e) {
        if(thisClass.autoHide)
            thisClass.hideContent();
        autoContent.style.display = "none";
    });
    thisClass.addListener(ContentEvent.CONTENT_SELECT, function(e) {
        if(thisClass.autoSet)
            thisClass.getInput().value = e.data;
    });
    thisClass.addListener(ContentEvent.CONTENT_OVER, function(e) {
        if(thisClass.autoSet)
            thisClass.getInput().value = e.data;
    });
    
	autoInput.onfocus = function(){
		showList();
		};
    
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
                showList();
                autoContent.innerHTML = thisClass.getContent(autoInput.value);
                thisClass.activeContent(0);
            break;
	    }
    }
    
}