
var extend = function(dest, from) {
    var props = Object.getOwnPropertyNames(from);
    props.forEach(function(name) {
        if (name in dest) {
            var destination = Object.getOwnPropertyDescriptor(from, name);
            Object.defineProperty(dest, name, destination);
        }
    });
    return dest;
};

var PM = function(elem, audioSamples, options) {
    var pm = this;

    pm.canvas = Canvas(elem);
    pm.ctx = pm.canvas.getContext("2d");

    var ctx = pm.ctx; // shortcut

    if(options === undefined) { options = {}; }
    pm.options = extend({
        resizeWithWindow: true,
    }, options);

    pm.hover = function(percent) {
    };

    pm.reset = function() {
        ctx.clearRect(0, 0, ctx.width, ctx.height);
    };
    
    pm.render = function() {
        pm.reset();
        ctx.fillStyle = '#a00';

        for(var i=0; i<pm.circles.length; i++) {
            var circle = pm.circles[i];
            ctx.beginPath();
            ctx.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI, false);
            ctx.fill();
        }
    };

    pm.animate = function(iter) {

        iter += 1;
        var iter_x = Math.sin(iter/400) * 100;
        var iter_y = Math.sin(iter/2000) * 200;

        window.requestAnimationFrame(function() {

            var pos = {
                x: iter_x,
                y: iter_y,
            }
            pm.disrupt(pos, iter);
        
            pm.render();
            if(pm.animating == true) {
                pm.animate(iter);
            }
        });
    };

    pm.circle = function(center, radius) {
        this.center = center;
        this.original_center = {
            x: center.x,
            y: center.y,
        };
        this.radius = radius;
    };

    pm.resize = function() {
        pm.cells = [];

        var size = 10;
        var mid = size / 2;

        pm.circles = [];

        canvasText = document.createElement("canvas");
        canvasText.width = ctx.width;
        canvasText.height = ctx.height;

        contextText = canvasText.getContext("2d");
        contextText.font = "100px Helvetica";
        contextText.fillStyle = "rgb(255, 0, 0)";
        contextText.textAlign = "left";

        var offset_x = 2;
        contextText.fillText("probably", offset_x, 80);
        contextText.fillText("murat", offset_x, 170);
        contextText.fillText("inc.", offset_x, 260);
        imageText = contextText.getImageData(0, 0, ctx.width, ctx.height);
        dataText = imageText.data;

        for(y = 0; y < ctx.height; y+=4) {
            for(x = 0; x < ctx.width; x+=4) {
                if (dataText[(x + y * ctx.width) * 4] > 0) {
                    var circle = new pm.circle({
                        x: x,
                        y: y,
                    }, 1.4);
                    pm.circles.push(circle);
                }
            }
        }

    };

    pm.distance = function(pos1, pos2) {
        var diff = {
            x: (pos1.x - pos2.x),
            y: (pos1.y - pos2.y),
        }

        return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2));
    }

    pm.gravity = function(distance) {
        return distance;
    }

    pm.disrupt = function(pos, iter) {
        for(var i=0; i<pm.circles.length; i++) {
            var circle = pm.circles[i];
            
            var distance = pm.distance(pos, circle.original_center);
            var push_x = pm.gravity(Math.sin(distance)) * 3;
            var push_y = pm.gravity(Math.cos(distance)) * 1.5;

            circle.center.y = circle.original_center.y + push_y;
            circle.center.x = circle.original_center.x + push_x;
        }
        pm.render();
        
    };

    pm.init = function() {

        pm.resize();
        pm.reset();

        var getCoordinates = function(that, e) {
            if(e && e.changedTouches && e.changedTouches[0]) {
                e = e.changedTouches[0];
            }

            var rect = that.getBoundingClientRect()
            var parentOffset = {
                top: rect.top + document.body.scrollTop,
                left: rect.left + document.body.scrollLeft
            }

            var x = e.pageX - parentOffset.left;
            var y = e.pageY - parentOffset.top;

            return {x: x, y: y};
        }

        var clickOrTap = function(e) {
            var pos = getCoordinates(this, e);
        };

        var hoverOrTouchMove = function(e) {
            var pos = getCoordinates(this, e);
            //pm.disrupt(pos);
            //pm.animating = false;
        };

        var mouseout = function(e){
        };

        elem.addEventListener('click', clickOrTap);
        elem.addEventListener('touchstart', hoverOrTouchMove);
        elem.addEventListener('mousemove', hoverOrTouchMove);
        elem.addEventListener('mouseout', mouseout);
        elem.addEventListener('touchend', mouseout);

        if(pm.options.resizeWithWindow === true) {
            var resizeHandler;
            window.addEventListener('resize', function(e){
                clearTimeout(resizeHandler);
                resizeHandler = setTimeout(function() {
                    setCanvasSize(pm.canvas, elem.offsetWidth, pm.canvas.offsetHeight);
                    pm.resize();
                }, 300);
            });
        }

        pm.iter = 0;
        pm.animating = true;
        pm.animate(pm.iter);
    };

    pm.init();
    return pm;
};
