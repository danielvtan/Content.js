/** Class: Dom
    creates a new instance of Dom. By default Dom is already instantiated
*/
function Dom() {
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
        Dom.create("div", testID);
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
		Dom.el("testID") // get element by id
		// returns an object with functions
		Dom.el("#testID") // get element by id
		// returns an object with functions
		Dom.el(".test-class") // get element by class name
		// returns an object with functions
		Dom.el("DIV") // get element by tag
		// returns an object with functions
		Dom.el(".test-class DIV") // get element by class and tag
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
	/** Function: addClass
        add a class to an element
        
        Parameters:
        target - dom target
		className - name of the class
        
        See Also:
        <removeClass>
	*/
	this.addClass = function(target, className) {
		var newClass = (target.className == "") ? className : target.className + " " + className;
		target.className = newClass;
	}
	/** Function: removeClass
        remove a class to an element
        
        Parameters:
		target - dom target
		className - name of the class
        
        See Also:
        <addClass>
	*/
	this.removeClass = function(target, className) {
		var classNames = target.className.split(" ");
		var newClass = "";
		for( var i = 0; i < classNames.length; ++i) {
			if(className != classNames[i]) {
				newClass += (i == 0) ? classNames[i] : " " + classNames[i];
			}
		}
		target.className = newClass;
	}
	function searchID(id, parent) {
		parent = (parent == undefined) ? doc : parent;
		var d = parent.getElementById(id);
		
		var data = {
			_dom:function() {
				return d;
			},
			css:function(css) {
				Css.apply(d, css);
				return searchID(id, parent);
			},
			set:function(key, val) {
				if(typeof val == "function") {
					d[key] = function() {
						val.call(data);
					};
				} else {
					d[key] = val;
				}
				
				return searchID(id, parent);
			},
			animate:function(duration, to, delta) {
				Animate.to(d, duration, to, delta);
				
			}
		};
		return data;
	}
	function searchClass(id, parents) {
		parents = (parents == undefined) ? [doc.body] : parents;
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
		var data = {
			_dom:function() {
				return list.length == 1 ? list[0] : list;
			},
			css:function(css) {
				for(var i = 0; i < list.length; ++i) {
					Css.apply(list[i], css);
				}
				return searchClass(id, parent);
			},
			set:function(key, val) {
				for(var i = 0; i < list.length; ++i) {
					if(typeof val == "function") {
						 list[i][key] = function() {
							val.call(data);
						 };
					} else {
						list[i][key] = val;
					}
				}
				return searchClass(id, parent);
			},
			animate:function(duration, to, delta) {
				for(var i = 0; i < list.length; ++i) {
					Animate.to(list[i], duration, to, delta);
				}
				
			}
		};
		return data;
	}
	function searchTag(tag, parents) {
		parents = (parents == undefined) ? [doc.body] : parents;
		var list = [];
		for(var i = 0; i < parents.length; ++i) {
			var tagList = parents[i].getElementsByTagName(tag);
			for(var j = 0; j < tagList.length; ++j) {
				list.push(tagList[j]);				
			}
		}
		var data = {
			_dom:function() {
				return list.length == 1 ? list[0] : list;
			},
			css:function(css) {
				for(var i = 0; i < list.length; ++i) {
					Css.apply(list[i], css);
				}
				return searchTag(tag, parents);
			},
			set:function(key, val) {
				for(var i = 0; i < list.length; ++i) {
					if(typeof val == "function") {
						 list[i][key] = function() {
							val.call(data);
						 };
					} else {
						list[i][key] = val;
					}
				}
				return searchTag(tag, parents);
			},
			animate:function(duration, to, delta) {
				for(var i = 0; i < list.length; ++i) {
					Animate.to(list[i], duration, to, delta);
				}
			}
		};
		if(list.length == 0)
			data = undefined;
		return data;
	}
}
window.Dom = new Dom();

/** Class: Css
    creates a new instance of Css. By default Css is already instantiated
*/
function Css() {
	var rules = {};
	/** Function: rule
        save a rule object
        
        Parameters:
		name - name/class rule
		css - rule object
        
        (start code)
        // returns apply the css object rules
        Css.apply(dom, { width:"100px"});
        (end)
	*/
	this.rule = function(name, css) {
			rules[name] = css;
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
				if(rules[css])
					css = rules[css];
				for(var attrib in css) {
					dom.style[attrib] = css[attrib];
				}
				return dom;
		}
}
window.Css = new Css();

// if Array.prototype.indexOf is not supported
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf=function(o,i){for(var j=this.length,i=i<0?i+j<0?0:i+j:i||0;i<j&&this[i]!==o;i++);return j<=i?-1:i}
}