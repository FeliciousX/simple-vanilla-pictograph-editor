/* Global namespace */
var piktochart = piktochart || {};
/* Constant variables */
piktochart.SVG_NS = 'http://www.w3.org/2000/svg';
piktochart.XLINK_NS = 'http://www.w3.org/1999/xlink';
piktochart.EDITOR_MIN_WIDTH = 800;
piktochart.EDITOR_MAX_HEIGHT = 600;
piktochart.TOOLBAR_HEIGHT = 64;
piktochart.ICON_SIZE = 52;

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
    var group = null;
    var icons = null;
    var label = null;
    var labelText = null;

    var obj = this;

    // Appends a new chart with id to .group-content
    // returns dragObject
    return function(id, editor) {
        if(typeof(editor) == 'string')
            editor = document.getElementById(editor);

        if(editor == null)
            return;

        chart = document.createElement('content');
        chart.id = 'data' + id;
        chart.className = 'drsElement drsMoveHandle';
        chart.style.top = '0px';
        chart.style.left = piktochart.EDITOR_MIN_WIDTH / 2 + 'px';
        // TODO: make size more dynamic based on number of icons
        chart.style.width = (piktochart.ICON_SIZE * 5) + 'px';
        chart.style.height = '35%';

        group  = document.createElement('div');
        group.className = 'group-content';

        icons = document.createElement('div');
        icons.className = 'icons';

        for (var i = 0; i < obj.iconNumber; i++) {
            var chartIcon = document.createElement('i');
            chartIcon.className = 'chart-icon ' + 'flaticon-' + obj.icon;
            icons.appendChild(chartIcon);
            chartIcon = null;
        }

        label = document.createElement('div');
        label.className = 'label';

        labelText = document.createElement('p');
        labelText.className = 'label-text';

        editor.appendChild(chart);
        chart.appendChild(group);
        group.appendChild(icons);
        group.appendChild(label);
        label.appendChild(labelText);
        labelText.appendChild(document.createTextNode(obj.label));

        obj.elem = chart;

        chart = null;
        icons = null;
        label = null;
        labelText = null;
        chartIcon = null;
    };
}

