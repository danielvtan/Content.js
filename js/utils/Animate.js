function Animate() {
    var animates = {};
    function animate(params) {
        var start = new Date;
        clearInterval(animates[params.id]);
        var id = setInterval(function() {
            var timePassed = new Date - start;
            var progress = timePassed / params.duration;
            
            if (progress > 1) progress = 1;
                
            var delta = params.delta(progress);
            params.step(delta);
            
            if (progress == 1)
                clearInterval(id);
        }, params.delay);
        
        animates[params.id] = id;   
    }
    this.to = function(element, duration, to, delta) {
        var from = {};
        for(var i in to) {
            from[i] = element.style[i] == "" ? 0 : parseInt(element.style[i]);
        }
        animate({
            id:element.id,
            delay: 1000/30,
            duration: duration,
            delta: delta,
            step: function(d) {
                for(var i in to) {
                    element.style[i] = from[i] + ((to[i] - from[i]) * d) + "px"; 
                } 
            }
        })
    }
    
    this.LINEAR = function(progress) {return progress};
    this.QUAD = function(progress) { return Math.pow(progress, 2) };
    this.CIRC = function(progress) { return 1 - Math.sin(Math.acos(progress)) };
    this.BACK = function(progress, x) { x = 1.5; return Math.pow(progress, 2) * ((x + 1) * progress - x) };
    this.ELASTIC = function elastic(progress, x) { x = 1;return Math.pow(2, 10 * (progress-1)) * Math.cos(20*Math.PI*x/3*progress) };
    this.ELASTIC_OUT = makeEaseOut(this.ELASTIC);
    this.BOUNCE = function(progress) {
        for(var a = 0, b = 1, result; 1; a += b, b /= 2) {
            if (progress >= (7 - 4 * a) / 11) {
                return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2)
            }
        }
    }
    this.BOUNCE_OUT = makeEaseOut(this.BOUNCE);
    function makeEaseOut(delta) {  
        return function(progress) {
            return 1 - delta(1 - progress);
        }
    }
}
window.Animate = new Animate();

