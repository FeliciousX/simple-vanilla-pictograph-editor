// hide the buttons on the toolbar and remove events
function hideToolbar() {
    var toolbar = document.getElementById('group_toolbar');
    toolbar.style.display = 'none';

    for(var i = 0; i < toolbar.children.length; i++) {
        toolbar.children[i].onclick = null;
    };
};

// jump start dragging and resizing on the editor
function setupEditor() {
    var drsConfig = {
        minWidth: 64,
        minHeight: 128,
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
        if(elm.className && elm.className.indexOf('drsMoveHandle') > -1)
            return true;
    };

    // show toolbar buttons
    dragresize.ondragfocus = function(id) {
        var toolbar = document.getElementById('group_toolbar');
        toolbar.style.display = 'block';

        var buttons = toolbar.children;
        var colorPicker = buttons[0];
        var delChart = buttons[1];

        colorPicker.onclick = function(e) {
            alert('colorPicker');
        };

        delChart.onclick = function(e) {
            piktochart.helper.deleteChart(id);
            hideToolbar();
        };

        colorPicker = null;
        zoomIn = null;
        zoomOut = null;
        delChart = null;
        buttons = null;
        toolbar = null;
    };

    dragresize.ondragblur = hideToolbar;

    /* optional, might be used later */
    dragresize.ondragstart = function(isResize) {};
    dragresize.ondragmove = function(isResize) {};
    dragresize.ondragend = function(isResize) {};

    dragresize.apply('editor');
}

window.onload = function() {
    if(typeof(piktochart) == 'undefined') {
        alert('piktochart.js not loaded!');
        return;
    }

    // run main
    hideToolbar();

    setupEditor();

    var addChart = document.getElementById('addChart');
    addChart.onclick = piktochart.helper.createChart;
    addChart = null;

};
