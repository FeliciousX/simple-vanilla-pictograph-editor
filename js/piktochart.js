/* Global namespace */
var piktochart = piktochart || {};
/* Constant variables */
piktochart.SVG_NS = 'http://www.w3.org/2000/svg';
piktochart.XLINK_NS = 'http://www.w3.org/1999/xlink';
piktochart.EDITOR_MIN_WIDTH = '800px';
piktochart.EDITOR_MIN_HEIGHT = '600px';

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
piktochart.helper = {
    // getting the current cursor position, especially when window is scrolled
    absoluteCursorPosition: function(eventObj) {
        eventObj = eventObj ? eventObj : window.event; // IE compatibility check

        if(isNaN(window.scrollX))
            return new piktochart.Position(eventObj.clientX
                            + document.documentElement.scrollLeft
                            + document.body.scrollLeft,
                                eventObj.clientY
                            + document.documentElement.scrollTop
                            + document.body.scrollTop);

        else
            return new piktochart.Position(eventObj.clientX + window.scrollX,
                                eventObj.clientY + window.scrollY);
    },
};

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
    return function(id, editorContent) {
        chart = document.createElement('content');
        chart.id = 'data' + id;

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

        chart = null;
        icons = null;
        label = null;
        labelText = null;
        chartIcon = null;
    };
}

/**
 * @public
 * @constructor
 * @param x coordinate
 * @param y coordinate
 *
 * Position object.
 */
piktochart.Position = function (x, y) {
    this.x = x;
    this.y = y;
};

// Take another position and add them together
piktochart.Position.prototype.add = function(val) {
    var newPos = new piktochart.Position(this.x, this.y);
    if(val != null) {
        if(!isNaN(val.x))
            newPos.x += val.x;
        if(!isNaN(val.y))
            newPos.y += val.y;
    }
    return newPos;
};

// Take another position and minus them together
piktochart.Position.prototype.subtract = function(val) {
    var newPos = new piktochart.Position(this.x, this.y);
    if(val != null) {
        if(!isNaN(val.x))
            newPos.x -= val.x;
        if(!isNaN(val.y))
            newPos.y -= val.y;
    }
    return newPos;
};

// Take another position and get the smallest value of x and y
// To find the top left coordinate between the 2 coordinate
piktochart.Position.prototype.min = function(val) {
    var newPos = new piktochart.Position(this.x, this.y);
    if(val == null)
        return newPos;

    if(!isNaN(val.x) && this.x > val.x)
        newPos.x = val.x;
    if(!isNaN(val.y) && this.y > val.y)
        newPos.y = val.y;

    return newPos;
};

// Take another position and get the max value of x and y
// To find the bottom right coordinate between the 2 coordinates
piktochart.Position.prototype.max = function(val) {
    var newPos = new piktochart.Position(this.x, this.y);
    if(val == null)
        return newPos;

    if(!isNaN(val.x) && this.x < val.x)
        newPos.x = val.x;
    if(!isNaN(val.y) && this.y < val.y)
        newPos.y = val.y;

    return newPos;
};

// Set the boundary where object can move to
piktochart.Position.prototype.bound = function(lower, upper) {
    var newPos = this.max(lower);
    return newPos.min(upper);
};

// make sure coordinates are proper
piktochart.Position.prototype.check = function() {
    var newPos = new piktochart.Position(this.x, this.y);
    if(isNaN(newPos.x))
        newPos.x = 0;
    if(isNaN(newPos.y))
        newPos.y = 0;
    return newPos;
};

// apply coordinate to element
// @param el as string or HTML Element
piktochart.Position.prototype.apply = function(el) {
    if(typeof(el) == 'string')
        el = document.getElementById(el);
    if(el == null)
        return;
    if(!isNaN(this.x))
        el.style.left = this.x + 'px';
    if(!isNaN(this.y))
        el.style.right = this.y + 'px';
};

/**
 * @public
 * @constructor
 * @param el html element or id of element
 * @param attachEl html element the element that will be the drag handle
 * @param lowerBound position object
 * @param upperBound position object
 * @param startCallback on start drag event
 * @param moveCallback on  drag event
 * @param endCallback on drag stop event
 * @param attachLater boolean
 *
 * Code referenced and modified from tech.pro
 * @link http://tech.pro/tutorial/650/javascript-draggable-elements
 *
 * dragObject function does all the heavy lifting for dragging objects
 * around the editor.
 */
function dragObject(el, attachEl, lowerBound, upperBound,
                    startCallback, moveCallback, endCallback, attachLater) {

    var cursorStartPos = null;
    var elementStartPos = null;
    var dragging = false;
    var listening = false;
    var disposed = false;

    if(typeof(el) == 'string')
        el = document.getElementById(el);
    if(el == null)
        return;

    if(lowerBound != null && upperBound != null) {
        var temp = lowerBound.min(upperBound);
        upperBound = lowerBound.max(upperBound);
        lowerBound = temp;
    }

    // public methods
    this.startListening = function() {
        if(listening || disposed)
            return;

        listening = true;
        piktochart.event.addListener(attachEl, "mousedown", dragStart_);
    };

    this.isDragging = function(){ return dragging; };
    this.isListening = function(){ return listening; };
    this.isDisposed = function(){ return disposed; };

    this.stopListening = function(stopCurrentDragging) {
        if(!listening || disposed)
            return;

        piktochart.event.removeListener(attachEl, 'mousedown', dragStart_);
        listening = false;

        if(stopCurrentDragging && dragging)
            dragStop_();
    }

    this.dispose = function() {
        if(disposed)
            return;

        this.stopListening(true);
        el = null;
        attachEl = null;
        lowerBound = null;
        upperBound = null;
        startCallback = null;
        moveCallback = null;
        endCallback = null;
        disposed = true;
    }
    // end public methods

    if(typeof(attachEl) == 'string')
        attachEl = document.getElementById(attachEl);
    if(attachEl == null)
        attachEl = el;

    if(!attachLater)
        this.startListening();

    // private methods
    function dragStart_(eventObj) {
        if(dragging || !listening || disposed)
            return;

        dragging = true;

        if(startCallback != null)
            startCallback(eventObj, el);

        cursorStartPos = piktochart.helper.absoluteCursorPosition(eventObj);

        elementStartPos = new piktochart.Position(parseInt(el.style.left),
                                                parseInt(el.style.top));

        elementStartPos = elementStartPos.check();

        piktochart.event.addListener(document, 'mousemove', dragGo_);
        piktochart.event.addListener(document, 'mouseup', dragStopHook_);

        return piktochart.event.cancelEvent(eventObj);
    }

    function dragGo_(eventObj) {
        if(!dragging || disposed)
            return;

        var newPos = piktochart.helper.absoluteCursorPosition(eventObj);
        newPos = newPos.add(elementStartPos);
        newPos = newPos.subtract(cursorStartPos);
        newPos = newPos.bound(lowerBound, upperBound);
        newPos.apply(el);
        if(moveCallback != null)
            moveCallback(newPos, el);

        return piktochart.event.cancelEvent(eventObj);
    }

    function dragStopHook_(eventObj) {
        dragStop_();
        return piktochart.event.cancelEvent(eventObj);
    }

    function dragStop_() {
        if(!dragging || disposed)
            return;

        piktochart.event.cancelEvent(document, 'mousemove', dragGo_);
        piktochart.event.cancelEvent(document, 'mouseup', dragStopHook_);
        cursorStartPos = null;
        elementStartPos = null;

        if (endCallback != null)
            endCallback(el);

        dragging = false;
    }

    // end private methods
}

