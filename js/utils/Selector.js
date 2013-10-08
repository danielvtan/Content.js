/** Class: Selector
    creates a new instance of Selector. By default Selector is already instantiated
*/
function Selector() {
	var doc = document;
	this.type = {
		DIV:"DIV",
		INPUT:"INPUT",
		UL:"UL",
		LI:"LI"
	};
	/** Function: create
        creates a dom element
        
		Parameters:
        type - name of element
		id - id of element
        
		Returns:
        a dom element
        
        (start code)
        // returns div element with an id of testID
        Selector.create("div", testID);
        (end)
	*/
	this.create = function(type, id) {
		var e = doc.createElement(type);
		if(id)
				e.id = id;
		return e;
	}
	/** Function: el
        use to get the element by using its id, tag or class
		
        Parameters:
        id - can be id, tag or class
		
        Returns:
        an element or mulitiple element
		
		(start code)
		// returns a normal dom element
		Selector.el("testID") // get element by id
		// returns an object with functions
		Selector.el("#testID") // get element by id
		// returns an object with functions
		Selector.el(".test-class") // get element by class name
		// returns an object with functions
		Selector.el("DIV") // get element by tag
		// returns an object with functions
		Selector.el(".test-class DIV") // get element by class and tag
        (end)
	*/
	this.el = function(id, parents) {
		var d;
		var ids = id.split(" ");
		var loopCount = 0;
		var loopMax = ids.length;
		function loopSearch(splitID, parents) {
			var key = splitID.substring(0, 1);
			var actualID;
			switch(key) {
				case "#":
					actualID = splitID.substring(1, id.length);
					d = searchID(actualID);
				break;
				case ".":
					actualID = splitID.substring(1, id.length);
					d = searchClass(actualID, parents);
				break;
				default:
					d = doc.getElementById(splitID);
					if(d == undefined) {
						d = searchTag(splitID, parents);
					}
				break;
			}
			if(loopCount < loopMax - 1) {
				loopCount++;
				loopSearch(ids[loopCount], d._dom());
			}
		}
		loopSearch(ids[0], parents);
		return d;
	}
	function searchID(id, parent) {
		parent = (parent == undefined) ? doc : parent;
		var d = parent.getElementById(id);
		return loadData.apply({list:[d], id:id, parents: parent, searchLoop: searchID});
	}
	function searchClass(id, parents) {
		parents = !parents ? [doc.body] : parents instanceof Array ? parents : [parents];
		var list = [];
		function loopSearch(dom, id) {
			for(var i = 0; i < dom.childNodes.length; ++i) {
				var child = dom.childNodes[i];
				if(child.nodeName == "#text")
					continue;
				
				if(child.className.split(" ").indexOf(id) > -1) {
					// found
					list.push(child);
				} else {
					if(child.childNodes.length > 0) {
						loopSearch(child, id);
					}
				}
			}
		}
		for(var i = 0; i < parents.length; ++i) {
			loopSearch(parents[i], id)
		}
        return loadData.apply({list:list, id:id, parents: parents, searchLoop: searchClass});
	}
	function searchTag(tag, parents) {
		parents = !parents ? [doc.body] : parents instanceof Array ? parents : [parents];
        
		var list = [];
		for(var i = 0; i < parents.length; ++i) {
			var tagList = parents[i].getElementsByTagName(tag);
			for(var j = 0; j < tagList.length; ++j)
				list.push(tagList[j]);
		}
		return loadData.apply({list:list, id:tag, parents: parents, searchLoop: searchTag});
	}
    function loadData() {
        var thisFunc = this;
        var data = {
			_dom:function() {
				return thisFunc.list.length == 1 ? thisFunc.list[0] : thisFunc.list;
			},
			css:function(css) {
               for(var i = 0; i < thisFunc.list.length; ++i) {
                    Selector.apply(thisFunc.list[i], css);
                }
                return thisFunc.searchLoop(thisFunc.id, thisFunc.parents);
			},
			set:function(key, val) {
				for(var i = 0; i < thisFunc.list.length; ++i) {
                    if(typeof val == "function") {
                         thisFunc.list[i][key] = function(e) {
                            val.call(data, e);
                         };
                    } else {
                        thisFunc.list[i][key] = val;
                    }
                }
                return thisFunc.searchLoop(thisFunc.id, thisFunc.parents);
			},
			animate:function(duration, to, delta) {
				for(var i = 0; i < thisFunc.list.length; ++i) {
                    Animate.to(thisFunc.list[i], duration, to, delta);
                }
			},
            addClass:function(cssClass) {
                for(var i = 0; i < thisFunc.list.length; ++i) {
                    Selector.addClass(thisFunc.list[i], cssClass);
                }
                return thisFunc.searchLoop(thisFunc.id, thisFunc.parents);
            },
            removeClass:function(cssClass) {
                for(var i = 0; i < thisFunc.list.length; ++i) {
                    Selector.removeClass(thisFunc.list[i], cssClass);
                }
                return thisFunc.searchLoop(thisFunc.id, thisFunc.parents);
            }
		}; 
        if(thisFunc.list.length == 0)
			data = undefined;
        return data;
    }
    
    /** Function: addClass
        add a class to an element
        
        Parameters:
        target - dom target
		className - name of the class
        
        See Also:
        <removeClass>
	*/
	this.addClass = function(dom, className) {
		var newClass = (dom.className == "") ? className : dom.className + " " + className;
		dom.className = newClass;
	}
	/** Function: removeClass
        remove a class to an element
        
        Parameters:
		target - dom target
		className - name of the class
        
        See Also:
        <addClass>
	*/
	this.removeClass = function(dom, className) {
		var classNames = dom.className.split(" ");
		var newClass = "";
		for( var i = 0; i < classNames.length; ++i) {
			if(className != classNames[i]) {
				newClass += (i == 0) ? classNames[i] : " " + classNames[i];
			}
		}
		dom.className = newClass;
	}
	/** Function: apply
        apply a rule/css object
		
        Parameters: 
        dom - dom element
		css - rule object
		
        Returns:
        the dom element
	*/
	this.apply = function(dom, css) {
            for(var attrib in css) {
                dom.style[attrib] = css[attrib];
            }
            return dom;
    }
}
window.Selector = new Selector();
window.el = Selector.el;

// if Array.prototype.indexOf is not supported
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf=function(o,i){for(var j=this.length,i=i<0?i+j<0?0:i+j:i||0;i<j&&this[i]!==o;i++);return j<=i?-1:i}
}