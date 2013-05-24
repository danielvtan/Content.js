/**
	@file Require
	<a href="../test.html">Demo</a>
	@author Daniel Tan
	@example
	// load an external javascript file
	Require.script("js/YourFile.js");
*/

/** By default Require is already instantiated
	@constructor
*/
var Require = new Require();
function Require(){
	var classes = [];
	var thisClass = this;
	this.baseURL = "";

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
        append(css, "href", thisClass.baseURL + classCall);
    }
	function scriptDependencies(classCall){
		var script = document.createElement("script");
		script.type = "text/javascript";
        append(script, "src", thisClass.baseURL + classCall);
	}
    function append(key, url) {
        dom[key] = url;
		var head = document.getElementsByTagName("head").item(0);
		head.appendChild(dom);
    }
}
// if Array.prototype.indexOf is not supported
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf=function(o,i){for(var j=this.length,i=i<0?i+j<0?0:i+j:i||0;i<j&&this[i]!==o;i++);return j<=i?-1:i}
}