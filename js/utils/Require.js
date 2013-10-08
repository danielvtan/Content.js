

/** Class: Require
    By default Require is already instantiated
	
    (start code)
    // load an external javascript file
	Require.script("js/YourFile.js");
    
    // load an external css file
	Require.css("css/mainstyle.css");
    (end)
*/
var Require = new Require();
function Require(){
	var classes = [];
	var thisClass = this;
	this.scriptURL = "js/";
    this.cssURL = "css/";
    this.css = function(classCall) {
        if(classes.indexOf(classCall) == -1)
            classes.push(classCall);
        cssDependencies(classCall);
    }
	this.script = function(classCall){
		if(classes.indexOf(classCall) == -1)
			classes.push(classCall);
		scriptDependencies(classCall);
	}
    function cssDependencies(classCall) {
        var css = document.createElement("link");
        css.rel = "stylesheet";
		css.type = "text/css";
        append(css, "href", thisClass.cssURL + classCall);
    }
	function scriptDependencies(classCall){
		var script = document.createElement("script");
		script.type = "text/javascript";
        append(script, "src", thisClass.scriptURL + classCall);
	}
    function append(dom, key, url) {
        dom[key] = url;
		var head = document.getElementsByTagName("head").item(0);
		head.appendChild(dom);
    }
}
// if Array.prototype.indexOf is not supported
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf=function(o,i){for(var j=this.length,i=i<0?i+j<0?0:i+j:i||0;i<j&&this[i]!==o;i++);return j<=i?-1:i}
}