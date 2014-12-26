/**
 * @public
 * @constructor
 * @param object name, string
 * @param config object
 *
 * Does all the heavy lifting for dragging and resizing
 *
 * Referenced from a demon on www.thinhelix.com
 * @link http://www.twinhelix.com/javascript/dragresize/demo/
 */
piktochart.DragResize = function(objName, config) {
    // default properties
    var props = {
        myName: objName,                    // Name of the object.
        enabled: true,                      // Global toggle of drag/resize.
        handles: ['tl', 'tm', 'tr',
            'ml', 'mr', 'bl', 'bm', 'br'],  // Array of drag handles: top/mid/bot/right.
        isElement: null,                    // Function ref to test for an element.
        isHandle: null,                     // Function ref to test for move handle.
        element: null,                      // The currently selected element.
        handle: null,                       // Active handle reference of the element.
        minWidth: 10, minHeight: 10,        // Minimum pixel size of elements.
        minLeft: 0, maxLeft: 9999,          // Bounding box area, in pixels.
        minTop: 0, maxTop: 9999,
        zIndex: 1,                          // The highest Z-Index yet allocated.
        mouseX: 0, mouseY: 0,               // Current mouse position, recorded live.
        lastMouseX: 0, lastMouseY: 0,       // Last processed mouse positions.
        mOffX: 0, mOffY: 0,                 // A known offset between position & mouse.
        elmX: 0, elmY: 0,                   // Element position.
        elmW: 0, elmH: 0,                   // Element size.
        allowBlur: true,                    // Whether to allow automatic blur onclick.
        ondragfocus: null,                  // Event handler functions.
        ondragstart: null,
        ondragmove: null,
        ondragend: null,
        ondragblur: null
    }

    for(var p in props) // if config variable is passed in, use them instead
        this[p] = (typeof (config[p]) == 'undefined') ? props[p] : config[p];
};

// Adds event handler to specified element
piktochart.DragResize.prototype.apply = function(el) {
    if(typeof(el) == 'string')
        el = document.getElementById(el);
    if(el == null)
        return;

    var obj = this;

    piktochart.event.addListener(el, 'mousedown', function(e) { obj.mouseDown(e); });
    piktochart.event.addListener(el, 'mousemove', function(e) { obj.mouseMove(e); });
    piktochart.event.addListener(el, 'mouseup', function(e) { obj.mouseUp(e); });
};

// Select an element to drag
piktochart.DragResize.prototype.select = function(el) {
    if(typeof(el) == 'string')
        el = document.getElementById(el);

    if(!this.enabled || el == null || el === this.element)
        return;

    this.element = el;
    // bring element forward and apply resize handles
    this.element.style.zIndex = ++this.zIndex;
    if(this.resizeHandleSet)
        this.resizeHandleSet(this.element, true);
    // record element attributes for mouseMove()
    this.elmX = parseInt(this.element.style.left);
    this.elmY = parseInt(this.element.style.top);
    this.elmW = this.element.offsetWidth;
    this.elmH = this.element.offsetHeight;
    if(this.ondragfocus)
        this.ondragfocus(el.id.replace('chart_', ''));
};

// Immediately stops dragging an element. If 'delHandles' is true, this
// remove the handles from the element and clears the element flag,
// completely resetting the editor
piktochart.DragResize.prototype.deselect = function(delHandles) {
    if(!this.enabled)
        return;

    if(delHandles) {
        if(this.ondragblur)
            this.ondragblur();
        if(this.resizeHandleSet)
            this.resizeHandleSet(this.element, false);
        this.element = null;
    }

    this.handle = null;
    this.mOffX = 0;
    this.mOffY = 0;
};

// Suitable elements are selected for drag/resize on mousedown.
// We also initialise the resize boxes, and drag parameters like mouse position etc.
piktochart.DragResize.prototype.mouseDown = function(e) {
    if(!this.enabled)
        return true;

    var elm = e.target || e.srcElement; // IE compatibility check
    var newEl = null;
    var newHandle = null;
    // handle's Regular Expression
    var hRE = new RegExp(this.myName + '-([trmbl]{2})', '');

    while(elm) {
        // Loop up the DOM loking for matching elements.
        if(elm.className) { // element has classname
            if(!newHandle && (hRE.test(elm.className) || this.isHandle(elm)))
                newHandle = elm;

            if(this.isElement && this.isElement(elm)) {
                newEl = elm;
                break;
            }
        }

        elm = elm.parentNode;
    }

    // If this isn't on the last dragged element, call deselect(),
    // which will hide its handles and clear element.
    if(this.element && (this.element != newEl) && this.allowBlur)
        this.deselect(true);

    // If we have a new matching element, call select()
    if (newEl && (!this.element || (newEl == this.element))) {
        // stop mouse selection if dragging a handle
        if(newHandle)
            piktochart.event.cancelEvent(e);

        this.select(newEl);
        this.handle = newHandle;

        if(this.handle && this.ondragstart)
            this.ondragstart(hRE.test(this.handle.className));
    }
};

// This continually offsets the dragged element by the difference between the
// last recorded mouse position (mouseX/Y) and the current mouse position.
piktochart.DragResize.prototype.mouseMove = function(e) {
    if (!this.enabled)
        return true;

    // always record the current mouse position
    this.mouseX = e.pageX || e.clientX + document.documentElement.scrollLeft;
    this.mouseY = e.pageY || e.clientY + document.documentElement.scrollTop;

    // record relative mouse movement, in case we're dragging
    // add any previously stored & ignored offset to the calculations
    var diffX = this.mouseX - this.lastMouseX + this.mOffX;
    var diffY = this.mouseY - this.lastMouseY + this.mOffY;
    this.mOffX = 0;
    this.mOffY = 0;

    // update last processed mouse positions
    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;

    // stop if we're not dragging element
    if (typeof(this.handle) == 'undefined' || !this.handle)
        return true;

    // run the resize handle drag if included in the script
    // create object representing the drag offsets
    var isResize = false;
    if(this.resizeHandleDrag && this.resizeHandleDrag(diffX, diffY)) {
        isResize = true;

    } else {
        // If the resize drag handler isn't set or returns false (to indicate the drag was
        // not on a resize handle), we must be dragging the whole element, so move that.
        // Bounds check left-right...
        var dX = diffX;
        var dY = diffY;

        if(this.elmX + dX < this.minLeft) {
            diffX = this.minLeft - this.elmX;
            this.mOffX = dX - diffX;

        } else if (this.elmX + this.elmW + dX > this.maxLeft) {
            diffX = this.maxLeft - this.elmX - this.elmW;
            this.mOffX = dX - diffX;
        }

        // .. and up-down.
        if (this.elmY + dY < this.minTop) {
            diffY = this.minTop - this.elmY;
            this.mOffY = dY - diffY;

        } else if (this.elmY + this.elmH + dY > this.maxTop) {
            diffY = this.maxTop - this.elmY - this.elmH;
            this.mOffY = dY - diffY;
        }

        this.elmX += diffX;
        this.elmY += diffY;
    }

    // Assign new info back to the element, with minimum dimensions
    this.element.style.left = this.elmX + 'px';
    this.element.style.top = this.elmY + 'px';
    this.element.style.width = this.elmW + 'px';
    this.element.style.height = this.elmH + 'px';

    if(this.ondragmove)
        this.ondragmove(this.isResize);

    // stop a normal drag event
    piktochart.event.cancelEvent(e);
};

// On mouseup, stop dragging, but don't reset handler visibility.
piktochart.DragResize.prototype.mouseUp = function(e) {
    if(!this.enabled)
        return;

    var hRE = new RegExp(this.myName + '-([trmbl]{2})', '');
    if (this.handle && this.ondragend)
        this.ondragend(hRE.test(this.handle.className));
    this.deselect(false);
};

// either creates, shows or hides the resize handles within an element
piktochart.DragResize.prototype.resizeHandleSet = function(el, show) {
    if(!this.enabled)
        return;

    if(typeof(el) == 'string')
        el = document.getElementById(el);

    if(el == null)
        return;

    if(!el._handle_tr) {
        for(var h = 0; h < this.handles.length; h++) {
            // creates 4 new divs, assign specific class
            var hDiv = document.createElement('div');
            hDiv.className = this.myName + ' ' + this.myName + '-' + this.handles[h];
            el['_handle_'+ this.handles[h]] = el.appendChild(hDiv);
        }
    }

    // find all the handles and show/hide
    for(var h = 0; h < this.handles.length; h++) {
        el['_handle_' + this.handles[h]].style.visibility = show ? 'inherit' : 'hidden';
    }

    // add border if show, hide otherwise
    el.style.border = show ? '1px solid black' : 'none';
};

// Passed the mouse movement amounts. This function checks to see whether the
// drag is from a resize handle created above; if so, it changes the stored
// element dimensions and mOffX/Y.
piktochart.DragResize.prototype.resizeHandleDrag = function(diffX, diffY) {
    if (!this.enabled)
        return false;

    var hRE = new RegExp(this.myName + '-([tmblr]{2})');
    var hClass = '';

    if (this.handle && this.handle.className)
        hClass = this.handle.className.match(hRE) ? RegExp.$1 : '';

    // If the hClass is one of the resize handles, resize one or two dimensions.
    // Bounds checking is the hard bit -- basically for each edge, check that the
    // element doesn't go under minimum size, and doesn't go beyond its boundary.
    var dY = diffY;
    var dX = diffX;
    var processed = false;

    if(hClass.indexOf('t') >= 0) { // top handle
        if(this.elmH - dY < this.minHeight) {
            diffY = this.elmH - this.minHeight;
            this.mOffY = this.dY - diffY;

        } else if(this.elmY + dY < this.minTop) {
            diffY = this.minTpo - this.elmY;
            this.mOffY = dY - this.diffy;
        }

        this.elmY += diffY;
        this.elmH -= diffY;
        processed = true;
    }

    if(hClass.indexOf('b') >= 0) { // bottom handle
        if(this.elmH + dY < this.minHeight) {
            diffY = this.minHeight - this.elmH;
            this.mOffY = dY - diffY;

        } else if(this.elmY + this.elmH + dY > this.maxTop) {
            diffY = this.maxTop - this.elmY - this.elmH;
            this.mOffY = dY - diffY;
        }

        this.elmH += diffY;
        processed = true;
    }

    if(hClass.indexOf('l') >= 0) { // left handle
        if(this.elmW - dX < this.minWidth) {
            diffX  = this.elmW - this.minWidth;
            this.mOffX = dX - diffX;

        } else if(this.elmX + dX < this.minLeft) {
            diffX = this.minLeft - this.elmX;
            this.mOffX = dX - diffX;
        }

        this.elmX += diffX;
        this.elmW -= diffX;
        processed = true;
    }

    if(hClass.indexOf('r') >= 0) { // right handle
        if(this.elmW + dX < this.minWidth) {
            diffX = this.minWidth - this.elmW;
            this.mOffX = dX - diffX;

        } else if(this.elmX + this.elmW + dX > this.maxLeft) {
            diffX = this.maxLeft - this.elmX - this.elmW;
            this.mOffX = dX - diffX;
        }

        this.elmW += diffX;
        processed = true;
    }

    return processed;
};

