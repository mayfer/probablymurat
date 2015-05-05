
function setCanvasSize(canvas, width, height) {
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    canvas.setAttribute('width', width + "px");
    canvas.setAttribute('height', height + "px");
    var context = canvas.getContext("2d");
    // make the h/w accessible from context obj as well
    context.width = width;
    context.height = height;

    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
    var ratio = devicePixelRatio / backingStoreRatio;

    // upscale the canvas if the two ratios don't match
    if(devicePixelRatio !== backingStoreRatio) {
        var oldWidth = canvas.width;
        var oldHeight = canvas.height;

        canvas.width = oldWidth * ratio;
        canvas.height = oldHeight * ratio;

        canvas.style.width = oldWidth + 'px';
        canvas.style.height = oldHeight + 'px';

        context.scale(ratio, ratio);
    }

}

function Canvas(elem) {
    var canvas = document.createElement('canvas');
    elem.appendChild(canvas);
    var width = elem.offsetWidth;
    var height = elem.offsetHeight;

    setCanvasSize(canvas, width, height);
    return canvas;
}

