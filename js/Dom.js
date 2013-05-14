var ti;
var te;
function Stat() {
    if(ti)
        te = new Date();
    else
        ti = new Date();
    if(ti && te) {
        //console.log(te-ti);
        te = ti = null;
    }
}

function Dom() {
    var doc = document;
    this.type = {
        DIV:"DIV",
        INPUT:"INPUT"
    };
    this.create = function(type, id) {
        var e = doc.createElement(type);
        if(id)
                e.id = id;
        return e;
    }
    this.add = function(parent, dom, className){
            if(className != null) {
                dom.setAttribute("class", className);
                dom.setAttribute("className", className);
            }
            parent.appendChild(dom);
            return dom;
    }
    this.el = function(id) {
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
        loopSearch(ids[0]);
        return d;
    }
    this.addClass = function(target, className) {
		if(target.className == "") {
            target.setAttribute("class", className);
            target.setAttribute("className", className);
        } else {
            target.setAttribute("class", target.className + " " + className);
            target.setAttribute("className", target.className + " " + className);
        }
            
	}
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
                return searchID(key);
            },
            set:function(key, val) {
                if(typeof val == "function") {
                    d[key] = function() {
                        val.call(data);
                    };
                } else {
                    d[key] = val;
                }
                
                return searchID(key);
            },
            animate:function(duration, to, delta) {
                Animate.to(d, duration, to, delta);
                
            }
        };
        return data;
    }
    function searchClass(id, parents) {
        parents = (parents == undefined) ? [doc.body] : parents;
        Stat();
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
        Stat();
        
        var data = {
            _dom:function() {
                return list;
            },
            css:function(css) {
                for(var i = 0; i < list.length; ++i) {
                    Css.apply(list[i], css);
                }
                return searchClass(id);
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
                return searchClass(id);
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
                return list;
            },
            css:function(css) {
                for(var i = 0; i < list.length; ++i) {
                    Css.apply(list[i], css);
                }
                return searchTag(tag);
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
                return searchTag(tag);
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
function Css() {
    var rules = {};
    this.rule = function(name, css) {
            rules[name] = css;
        }
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