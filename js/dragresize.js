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
 * This object does all the heavy lifting for dragging elements
 * around the editor.
 */
piktochart.DragObject = function(el, attachEl, lowerBound, upperBound,
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

