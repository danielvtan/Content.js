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
	var classes = []
	var thisClass = this;
	this.baseURL = "";
	/** load a script
		@param {String} classCall - url of the js file
	*/
	this.script = function(classCall){
		if(classes.indexOf(classCall) == -1)
			classes.push(classCall);
		scriptDependencies(classCall);
	}
	function scriptDependencies(classCall){
		var script = document.createElement("script");
		script.src = thisClass.baseURL + classCall;
		script.type = "text/javascript";
		//script.defer = true;
		//script.id = "scriptID";
		var head = document.getElementsByTagName("head").item(0);
		head.appendChild(script)
	}
}
// if Array.prototype.indexOf is not supported
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf=function(o,i){for(var j=this.length,i=i<0?i+j<0?0:i+j:i||0;i<j&&this[i]!==o;i++);return j<=i?-1:i}
}