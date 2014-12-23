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
        el.style.top = this.y + 'px';
};

/* Extends the helper function */
piktochart.helper.absoluteCursorPosition = function(eventObj) {
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
};
