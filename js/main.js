// stores all the content object
var contentArr = [];

// Initialize temp data
// TODO: make data dynamic
function init() {
    contentArr.push({ chart: new piktochart.Chart('Women', 120, 5, 'women13')});
    contentArr.push({ chart: new piktochart.Chart('Dog', 60, 10, 'dog77')});
    contentArr.push({ chart: new piktochart.Chart('Cat', 70, 10, 'cat19')});
    contentArr.push({ chart: new piktochart.Chart('Brain', 80, 10, 'brain5')});
    contentArr.push({ chart: new piktochart.Chart('Dog', 60, 10, 'dog77')});
    contentArr.push({ chart: new piktochart.Chart('Dog', 120, 2, 'dog77')});
}

/* Main function to bind them all */
function main() {
    var editor = document.getElementById('editor');
    var chart = null;
    for (var i = 0; i < contentArr.length; i++) {
        chart = contentArr[i].chart.generateChart();
        chart(i, editor);
        chart = null;
    }
    editor = null;
}

window.onload = function() {
    if (typeof(piktochart) == 'undefined') {
        alert('piktochart.js not loaded!');
        return;
    }
    // initialize dummy data
    init();

    // run main
    main();

    var drsConfig = {
        minWidth: 64,
        minHeight: 64,
        minLeft: 0,
        minTop: 0,
        maxTop: piktochart.EDITOR_MAX_HEIGHT,
    };

    var dragresize = new piktochart.DragResize('dragresize', drsConfig);

    // to check if it's the element we want
    dragresize.isElement = function(elm)
    {
        if (elm.className && elm.className.indexOf('drsElement') > -1) return true;
    };

    // to check if it's the handle element we want
    dragresize.isHandle = function(elm)
    {
        if (elm.className && elm.className.indexOf('drsMoveHandle') > -1) return true;
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
};
