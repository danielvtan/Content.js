if(window.Content == null)
	throw "AutoComplete requires Content.js";
AutoComplete.prototype = Content;
AutoComplete.prototype.constructor = AutoComplete;
function AutoComplete(containerID) {
    Content.apply(this, arguments);
    
	var thisClass = this;
   
	var con = Dom.el(containerID);
    Dom.addClass(con, "auto-con");
	con.innerHTML = '<input id="'+ containerID + 'Input" class="auto-input" name="' + containerID + '" type="text" autocomplete="off"><div class="content-con" id="' + containerID + 'ContentCon"></div>';
    
    
    
	
	var autoContent = Dom.el(containerID + "ContentCon");
	var autoInput = Dom.el(containerID + "Input");
	
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
	autoInput.onfocus = function(){
		showList();
		};
    
    autoInput.onkeydown = function(e) {
         switch(code) {
		    case 13:
                thisClass.selectContent(thisClass.getCurrentActive());
                thisClass.dispatchEvent(ContentEvent.CONTENT_SELECT, thisClass.getList()[thisClass.getCurrentActive()])
                
                e.preventDefault();
		    break;
		    default:
		    break;
	    }
        e.preventDefault();
    }
	autoInput.onkeyup = function(e) {
	    var code = thisClass.keyCode(e);
        
	    switch(code){
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
	    
	    //if(autoInput.value == "") {
		  //thisClass.hideContent();
	    //}

	}
}