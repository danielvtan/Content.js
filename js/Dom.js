var ti;
var te;
function Stat() {
    if(ti)
        te = new Date();
    else
        ti = new Date();
    if(ti && te) {
        console.log(te-ti);
        te = ti = null;
    }
}

function Dom() {
    var dom = document;
    this.type = {
        DIV:"div"
    };
    this.create = function(type, id) {
        var e = document.createElement(type);
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
        var key = id.substring(0, 1);
        var actualID;
        if(key == "#") {
            actualID = id.substring(1, id.length);
            d = searchID(actualID);
        } else if(key == ".") {
            actualID = id.substring(1, id.length);
            d = searchClass(actualID);
        } else {
            d = dom.getElementById(id);
        }
        return d;
    }
    this.addClass = function(target, className) {
		target.setAttribute("class", target.className + " " + className);
		target.setAttribute("className", target.className + " " + className);
	}
	this.removeClass = function(target, className) {
		var regEx = new RegExp(className, "i");
		target.className = target.className.replace(regEx, "");
	}
    function searchID(key) {
        var d = dom.getElementById(key);
        return {
            css:function(css) {
                Css.apply(d, css);
                return searchID(key);
            },
            set:function(key, val) {
                d[key] = val;
                return searchID(key);
            }
        };
    }
    function searchClass(id) {
            Stat();
            var list = [];
            function loopSearch(dom, id) {
                for(var i = 0; i < dom.childNodes.length; ++i) {
                    var child = dom.childNodes[i];
                    if(child.nodeName == "#text")
                        continue;
                    if(child.className.indexOf(id) > -1) {
                        // found
                        list.push(child);
                    } else {
                        if(child.childNodes.length > 0) {
                            loopSearch(child, id);
                        }
                    }
                }
            }
            loopSearch(document.body, id)
            Stat();
            return {
                css:function(css) {
                    for(var i = 0; i < list.length; ++i) {
                        Css.apply(list[i], css);
                    }
                    return searchClass(id);
                },
                set:function(key, val) {
                    for(var i = 0; i < list.length; ++i) {
                        list[i][key] = val;
                    }
                    return searchClass(id);
                }
            };
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