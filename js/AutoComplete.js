
if(window.Content == null)
	throw "AutoComplete requires Content.js";
AutoComplete.prototype = new Content();
AutoComplete.prototype.constructor = AutoComplete;
function AutoComplete(containerID) {
	var elem = this.elem;
	var thisClass = this;
	
	var con = elem(containerID);
	con.innerHTML = '<input id="'+ containerID + 'Input" type="text" autocomplete="off"><div id="' + containerID + 'ContentCon"></div>';
	
	var autoContent = elem(containerID + "ContentCon");
	var autoInput = elem(containerID + "Input");
	
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
		    case 13:
			    // enter key
			thisClass.selectContent(thisClass.getCurrentActive());
		    break;
		    default:
			    // nay other key
			showList();
			autoContent.innerHTML = thisClass.getContent(autoInput.value);
			thisClass.activeContent(0);
			   
		    break;
	    }
	    
	    if(autoInput.value == "") {
		thisClass.hideContent();
	    }

	}
}