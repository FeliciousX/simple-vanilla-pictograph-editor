/* Global namespace */
var piktochart = piktochart || {};
/* Constant variables */
piktochart.SVG_NS = 'http://www.w3.org/2000/svg';
piktochart.XLINK_NS = 'http://www.w3.org/1999/xlink';
piktochart.EDITOR_MIN_WIDTH = 800;
piktochart.EDITOR_MAX_HEIGHT = 600;
piktochart.TOOLBAR_HEIGHT = 64;
piktochart.ICON_SIZE = 52;

// Associative Array of Chart objects
piktochart.chartArr = {};

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
    cancelEvent: function(e) {
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
    // delete chart and it's associated view
    deleteChart: function(id) {
        if(id in piktochart.chartArr) {
            piktochart.chartArr[id].elem.remove();
            piktochart.chartArr[id].data.remove();

            piktochart.chartArr[id].elem = null;
            piktochart.chartArr[id].data = null;

            delete piktochart.chartArr[id];
        }
    },
    createChart: function(e) {
        piktochart.event.cancelEvent(e);

        var cLabel = document.getElementById('cLabel');
        var cValue = document.getElementById('cValue');
        var iRatio = document.getElementById('iRatio');
        var cIcon = document.getElementById('cIcon');
        var selectedIcon = cIcon.options[cIcon.selectedIndex];
        var complete = true;

        // do form checking
        if((typeof(selectedIcon) == 'undefined') || selectedIcon.value === '') {
            cIcon.focus();
            alert('Please select an icon');
            complete = false;
        }
        if(iRatio.value === '') {
            iRatio.focus();
            alert('Icon Value must not be empty');
            complete = false;
        }
        if(cValue.value === '') {
            cValue.focus();
            alert('Data Value must not be empty');
            complete = false;
        }
        if(cLabel.value === '') {
            cLabel.focus();
            alert('Data Name must not be empty');
            complete = false;
        }

        if(complete) { // form checking passed
            // value of highest id
            var chartId = document.getElementById('chartId');

            // create new Chart object
            var chart = new piktochart.Chart(cLabel.value, parseInt(cValue.value),
                    parseInt(iRatio.value), selectedIcon.value);

            chart.generateChart(chartId.value, 'editor');

            // add chart to array
            piktochart.chartArr[chartId.value] = chart;

            chartId.value = parseInt(chartId.value) + 1;

            generate = null;
            chart = null;
            chartId = null;
        }

        cLabel = null;
        cValue = null;
        iRatio = null;
        cIcon = null;
        selectedIcon = null;

        // reset inputs
        document.getElementById('userForm').reset();
    },
};

/**
 * @public
 * @constructor
 * Chart object
 */
piktochart.Chart = function (label, value, ratio, icon) {
    this.label = label; // Label to be shown on chart
    this.value = value; // Total value of chart
    this.ratio = ratio; // The value of 1 icon
    this.icon = icon;   // icon name used
    this.iconNumber = this.value / this.ratio; // number of icons needed
    this.elem = null;   // chart DOM reference
    this.data = null;   // data DOM reference
};

/**
 * Generates the HTML code for the chart
 * @public
 * @param id int unique id for each chart
 * @param editor element to append chart to
 */
piktochart.Chart.prototype.generateChart = function(id, editor) {
    var chart = null;
    var group = null;
    var icons = null;
    var label = null;
    var labelText = null;

    // Appends a new chart to the editor
    if(typeof(editor) == 'string')
        editor = document.getElementById(editor);

    if(editor == null)
        return;

    chart = document.createElement('content');
    chart.id = 'chart_' + id;
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

    for (var i = 0; i < this.iconNumber; i++) {
        var chartIcon = document.createElement('i');
        chartIcon.className = 'chart-icon ' + 'flaticon-' + this.icon;
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
    labelText.appendChild(document.createTextNode(this.label));

    // store the element on the object itself
    this.elem = chart;

    // generate and show the chart data
    this.addDataHTML_(id);

    // add to chartArr
    piktochart.chartArr[id] = this;

    chart = null;
    icons = null;
    label = null;
    labelText = null;
    chartIcon = null;
}

// This function adds a new div that shows the chart data on the bottom of the page
piktochart.Chart.prototype.addDataHTML_ = function(id) {
    var div = document.createElement('div');
    var pLabel = document.createElement('p');
    var pValue = document.createElement('p');
    var pRatio = document.createElement('p');
    var pIcon = document.createElement('p');
    var icon = document.createElement('i');
    var delBtn = document.createElement('button');

    div.appendChild(pLabel);
    div.appendChild(pValue);
    div.appendChild(pRatio);
    div.appendChild(pIcon);
    div.appendChild(delBtn);
    pLabel.appendChild(document.createTextNode('Label: ' + this.label));
    pValue.appendChild(document.createTextNode('Value: ' + this.value));
    pRatio.appendChild(document.createTextNode('Icon Value: ' + this.ratio));
    pIcon.appendChild(document.createTextNode('Icon Selected: '));
    pIcon.appendChild(icon);
    delBtn.appendChild(document.createTextNode('Delete'));

    div.id = 'data_' + id;
    div.className = 'user-data';
    icon.className = 'flaticon-' + this.icon;

    delBtn.value = id;
    delBtn.onclick = function(e) {
        piktochart.event.cancelEvent(e);

        // button's value contains the id
        piktochart.helper.deleteChart(this.value);
    };

    document.getElementById('userData').appendChild(div);

    this.data = div;

    div = null;
    pLabel = null;
    pValue = null;
    pRatio = null;
    pIcon = null;
    icon = null;
    delBtn = null;
};

