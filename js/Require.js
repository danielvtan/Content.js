var Require = new Require();
function Require(){
    var classes = []
    var thisClass = this;
    this.baseURL = "";
    this.script = function(classCall){
        if(classes.indexOf(classCall) == -1)
            classes.push(classCall);
        scriptDependencies(classCall);
    }
    this.test = function() {
        for(var i = 0; i < classes.length; ++i) {
            thisClass.script(classes[i]);
            console.log("ga");
        }
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