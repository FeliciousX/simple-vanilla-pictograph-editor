// hide the color picker
function hideColorPicker() {
    var canvas = document.getElementById('colorPicker');
    canvas.style.display = 'none';
};

// hide the buttons on the toolbar and remove events
function hideToolbar() {
    var toolbar = document.getElementById('group_toolbar');
    toolbar.style.display = 'none';

    for(var i = 0; i < toolbar.children.length; i++) {
        toolbar.children[i].onclick = null;
    };

    hideColorPicker();
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

        // toggle show color pallette
        colorPicker.onclick = function(e) {
            var canvas = document.getElementById('colorPicker');

            if(canvas.style.display == 'none')
                canvas.style.display = 'block';
            else
                canvas.style.display = 'none';
        };

        delChart.onclick = function(e) {
            piktochart.helper.deleteChart(id);
            hideToolbar();
        };

        // sets the current selected chart id on html
        var currentId = document.getElementById('currentId');
        currentId.value = id;

        currentId = null;
        colorPicker = null;
        zoomIn = null;
        zoomOut = null;
        delChart = null;
        buttons = null;
        toolbar = null;
    };

    dragresize.ondragblur = hideToolbar;

    dragresize.ondragstart = function(isResize) {
        hideColorPicker();
    };

    /* other dragresize API that can be extended */
    dragresize.ondragmove = function(isResize) {};
    dragresize.ondragend = function(isResize) {};

    dragresize.apply('editor');
}

window.onload = function() {
    if(typeof(piktochart) == 'undefined') {
        alert('piktochart.js not loaded!');
        return;
    }

    var canvas = document.getElementById('colorPicker');
    canvas.onclick = piktochart.helper.getCanvasColorValue;

    // image credit http://www.script-tutorials.com/html5-color-picker-canvas/
    var img = new Image();
    img.src = 'img/colorwheel.png';

    img.onload = function() {
        canvas.getContext('2d').drawImage(img, 0, 0);
    };

    // hide views
    hideToolbar();

    setupEditor();

    var addChart = document.getElementById('addChart');
    addChart.onclick = piktochart.helper.createChart;

    addChart = null;
};
