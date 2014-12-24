// Main function to make all chart draggable and resizeable
function main() {
    var drsConfig = {
        minWidth: 64,
        minHeight: 64,
        minLeft: 0,
        minTop: 0,
        maxTop: piktochart.EDITOR_MAX_HEIGHT,
    };

    var dragresize = new piktochart.DragResize('dragresize', drsConfig);

    // to check if it's the element we want
    dragresize.isElement = function(elm) {
        if(elm.className && elm.className.indexOf('drsElement') > -1)
            return true;
    };

    // to check if it's the handle element we want
    dragresize.isHandle = function(elm) {
        if (elm.className && elm.className.indexOf('drsMoveHandle') > -1)
            return true;
    };

    dragresize.ondragfocus = function() {
        // TODO: add button on toolbar for zooming and delete
    };
    dragresize.ondragblur = function() {
        // TODO: remove button on toolbars associated with ondragfocus
    };

    /* optional, might be used later */
    dragresize.ondragstart = function(isResize) {};
    dragresize.ondragmove = function(isResize) {};
    dragresize.ondragend = function(isResize) {};

    dragresize.apply(document);
}

window.onload = function() {
    if(typeof(piktochart) == 'undefined') {
        alert('piktochart.js not loaded!');
        return;
    }
    // run main
    main();

    var addChart = document.getElementById('addChart');
    addChart.onclick = piktochart.helper.createChart;

};
