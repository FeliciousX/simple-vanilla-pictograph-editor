/* Global namespace */
var piktochart = piktochart || {};
/* Constant variables */
piktochart.SVG_NS = 'http://www.w3.org/2000/svg';
piktochart.XLINK_NS = 'http://www.w3.org/1999/xlink';
piktochart.EDITOR_MIN_WIDTH = 800;
piktochart.EDITOR_MIN_HEIGHT = 600;
piktochart.TOOLBAR_HEIGHT = 64;

/* Stores all event functions wrapper that is IE compatible */
piktochart.event = {
    addListener: function(el, eventName, callback) {
        if(typeof(el) == 'string')
            el = document.getElementById(el);
        if(el == null)
            return;
        if(el.addEventListener) // function exist!
            el.addEventListener(eventName, callback, false);
        else if(el.attachEvent) // IE compatibility check
            el.attachEvent("on" + eventName, callback);
    },
    removeListener: function(el, eventName, callback) {
        if(typeof(el) == 'string')
            el = document.getElementById(el);
        if(el == null)
            return;
        if(el.removeEventListener)
            el.removeEventListener(eventName, callback, false);
        else if(el.detachEvent) // IE compatibility check
            el.detachEvent("on" + eventName, callback);
    },
    getEvent: function(e) {
        if(!e)
            e = window.event;
        if(e.target)
            return e.target;
        return e.srcElement; // IE compatible event
    },
    cancelEvent(e) {
        if(!e)
            e = window.event;
        if(e.stopPropagation)
            e.stopPropagation();
        if(e.preventDefault)
            e.preventDefault();
        e.cancelBubble = true;
        e.cancel = true;
        e.returnValue = false;
        return false;
    },
};

/* stores all helper functions */
piktochart.helper = {};

/**
 * @public
 * @constructor
 * @param label String for chart label
 * @param value int for the value of chart
 * @param ratio int the ratio of icons to value
 * @param icon String name of icon chosen
 */
piktochart.Chart = function (label, value, ratio, icon) {
    this.label = label;
    this.value = value;
    this.ratio = ratio;
    this.icon = icon;
    this.iconNumber = this.value / this.ratio;
    this.elem = null;
    this.dragObject = null;
};

/**
 * Generates the HTML code for the chart
 * @public
 * @return the function to append new chart
 */
piktochart.Chart.prototype.generateChart = function() {
    var chart = null;
    var icons = null;
    var label = null;
    var labelText = null;
    var chartIcon = null;

    var obj = this;

    // Appends a new chart with id to .group-content
    // returns dragObject
    return function(id, editorContent) {
        chart = document.createElement('content');
        chart.id = 'data' + id;
        chart.style.top = piktochart.TOOLBAR_HEIGHT + 15 + 'px';
        chart.style.left = piktochart.EDITOR_MIN_WIDTH / 2 + 'px';

        icons = document.createElement('div');
        icons.className = 'icons';

        chartIcon = document.createElement('i');
        chartIcon.className = 'chart-icon ' + 'flaticon-' + obj.icon;

        label = document.createElement('div');
        label.className = 'label';

        labelText = document.createElement('p');
        labelText.className = 'label-text';

        editorContent.appendChild(chart);
        chart.appendChild(icons);

        for (var i = 0; i < obj.iconNumber; i++) {
            icons.appendChild(chartIcon.cloneNode(true));
        }

        chart.appendChild(label);

        label.appendChild(labelText);
        labelText.appendChild(document.createTextNode(obj.label));

        obj.elem = chart;
        obj.dragObject = new piktochart.DragObject(chart, null,
                new piktochart.Position(0, piktochart.TOOLBAR_HEIGHT),
                new piktochart.Position(piktochart.EDITOR_MIN_WIDTH,
                    piktochart.EDITOR_MIN_HEIGHT));

        chart = null;
        icons = null;
        label = null;
        labelText = null;
        chartIcon = null;
    };
}

