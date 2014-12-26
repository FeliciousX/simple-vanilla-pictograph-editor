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
    // creates a new chart by taking input from form
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

            // reset inputs
            document.getElementById('userForm').reset();

            generate = null;
            chart = null;
            chartId = null;
        }

        cLabel = null;
        cValue = null;
        iRatio = null;
        cIcon = null;
        selectedIcon = null;
    },
    // edit existing chart
    editChart: function(id) {
        var data = document.getElementById('data_'+id);

        var inputs = data.getElementsByTagName('input');

        var cLabel = inputs[0];
        var cValue = inputs[1];
        var iRatio = inputs[2];
        var cIcon = document.getElementById('cIcon_'+id);
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
            var chart = piktochart.chartArr[id];

            // edit chart with new data
            chart.edit(cLabel.value, parseInt(cValue.value),
                    parseInt(iRatio.value), selectedIcon.value);

            chart = null;
        }

        cLabel = null;
        cValue = null;
        iRatio = null;
        cIcon = null;
        selectedIcon = null;

        return complete;
    },
    // show the inputs to edit chart data
    toggleChartEdit: function(id) {
        var cData = document.getElementById('data_' + id);

        var inputs = cData.getElementsByTagName('input');

        for(var i = 0; i < inputs.length; i++) {
            inputs[i].removeAttribute('readonly');
        }

        var selectOptions = document.getElementById('cIcon');
        var cln = selectOptions.cloneNode(true);
        cln.id = 'cIcon_'+id;

        // there's only 1 icon
        var icon = cData.getElementsByTagName('i')[0];
        var parentDiv = icon.parentNode;

        parentDiv.replaceChild(cln, icon);

        var saveBtn = document.createElement('button');
        saveBtn.appendChild(document.createTextNode('Save'));

        // is there memory leak here on this function?
        // I know a closure is created but I dont know if it will leak or not
        // I can create a separate function just for saving somewhere else
        // but I'm just going to do this for the sake of comments from Piktochart :)
        saveBtn.onclick = function(e) {
            piktochart.event.cancelEvent(e);

            // edit chart
            var success = piktochart.helper.editChart(id);

            if(success) {
                for(var i = 0; i < inputs.length; i++)
                    inputs[i].setAttribute('readonly', 'readonly');

                parentDiv2.replaceChild(editBtn, saveBtn);
            }
        };

        // 1st button is the edit button
        var editBtn = cData.getElementsByTagName('button')[0];
        var parentDiv2 = editBtn.parentNode;

        parentDiv2.replaceChild(saveBtn, editBtn);

        selectOptions = null;
        cData = null;
    },
    // change current selected color
    changeCurrentChartColor: function(hex) {
        var currentId = document.getElementById('currentId').value;

        piktochart.chartArr[currentId].colorChange(hex);
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
    this.iconNumber = 0; // number of icons needed
    this.elem = null;   // chart DOM reference
    this.data = null;   // data DOM reference

    this.iconNumber = this.getIconNumber();
};

/**
* Calculate the number of icons needed
* @public
* @return int
*/
piktochart.Chart.prototype.getIconNumber = function() {
    if(this.iconNumber > 0)
        return this.iconNumber;

    var remain = this.value % this.ratio;
    var icons = this.value / this.ratio;

    // only if the remainder is more than half the ratio value
    // adds an extra icon.
    if(remain >= this.ratio / 2 || remain === 0) {
        this.iconNumber = icons;
        return icons;

    } else {
        this.iconNumber = icons - 1;
        return icons - 1;
    }
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
};

// This function adds a new tr that shows the chart data on the bottom of the page
piktochart.Chart.prototype.addDataHTML_ = function(id) {
    var tr = document.createElement('tr');
    var editBtn = document.createElement('button');
    var delBtn = document.createElement('button');
    var pLabel = document.createElement('td');
    var pValue = document.createElement('td');
    var pRatio = document.createElement('td');
    var pIcon = document.createElement('td');
    var pEditBtn = document.createElement('td');
    var pDelBtn = document.createElement('td');
    var icon = document.createElement('i');
    var input = null;

    tr.appendChild(pLabel);
    tr.appendChild(pValue);
    tr.appendChild(pRatio);
    tr.appendChild(pIcon);
    tr.appendChild(pEditBtn);
    tr.appendChild(pDelBtn);

    input = document.createElement('input');
    input.value = this.label;
    input.setAttribute('readonly', 'readonly');
    pLabel.appendChild(input);

    input = document.createElement('input');
    input.value = this.value;
    input.setAttribute('readonly', 'readonly');
    pValue.appendChild(input);

    input = document.createElement('input');
    input.value = this.ratio;
    input.setAttribute('readonly', 'readonly');
    pRatio.appendChild(input);

    pIcon.appendChild(icon);
    pEditBtn.appendChild(editBtn);
    pDelBtn.appendChild(delBtn);

    editBtn.appendChild(document.createTextNode('Edit'));
    delBtn.appendChild(document.createTextNode('Delete'));

    tr.id = 'data_' + id;
    tr.className = 'user-data';
    icon.className = 'flaticon-' + this.icon;

    editBtn.value = id;
    editBtn.setAttribute('name', 'edit');
    editBtn.onclick = function(e) {
        piktochart.event.cancelEvent(e);

        // edit chart
        piktochart.helper.toggleChartEdit(this.value);
    }

    delBtn.value = id;
    delBtn.setAttribute('name', 'delete');
    delBtn.onclick = function(e) {
        piktochart.event.cancelEvent(e);

        // button's value contains the id
        piktochart.helper.deleteChart(this.value);
    };

    document.getElementById('userData').appendChild(tr);

    // add DOM element to object itself
    this.data = tr;

    tr = null;
    pLabel = null;
    pValue = null;
    pRatio = null;
    pIcon = null;
    icon = null;
    editBtn = null
    delBtn = null;
    pEditBtn = null;
    pDelBtn = null;
};

// Edit current chart with new data
piktochart.Chart.prototype.edit = function(label, value, ratio, icon) {

    // query only once
    var inputs = this.data.getElementsByTagName('input');
    var totalIcons = this.elem.getElementsByTagName('i');

    if(label != '' && label !== this.label) {
        this.label = label;

        // change chart label
        // there's only 1 <p> element
        var cLabel = this.elem.getElementsByTagName('p')[0];
        cLabel.textContent = this.label;

        // first <input> is label
        inputs[0].value = this.label;
    }

    if(!isNaN(value) && value !== this.value) {
        this.value = value;

        // the second <input> is value
        inputs[1].value = this.value;
    }

    if(!isNaN(ratio) && ratio !== this.ratio) {
        this.ratio = ratio;

        // the third <input> shows ratio
        inputs[2].value = this.ratio;
    }

    var newIconNumber = this.value / this.ratio;
    if(!isNaN(newIconNumber) && newIconNumber != this.iconNumber) {

        if(newIconNumber < this.iconNumber) {
            // delete the extra icons
            // Delete from behind because the length and index changes while removing
            for(var i = this.iconNumber - 1; i >= newIconNumber; i--) {
                totalIcons[i].remove();
            }

        } else if(newIconNumber > this.iconNumber) {
            var icons = this.elem.getElementsByClassName('icons')[0];
            // add more icons!
            for(var i = this.iconNumber; i < newIconNumber; i++) {
                var newIcon = document.createElement('i');
                newIcon.className = 'chart-icon flaticon-'+this.icon;
                icons.appendChild(newIcon);
                newIcon = null;
            }

            icons = null;
        }

        this.iconNumber = newIconNumber;
    }

    if(icon != '' && icon !== this.icon) {

        // changing all the icons on the chart
        for(var i = 0; i < totalIcons.length; i++) {
            totalIcons[i].className = 'chart-icon flaticon-'+icon;
        }

        // prepare to replace <select> with icon
        var cIcon = document.createElement('i');
        cIcon.className = 'flaticon-' + icon;

        // there's only 1 <select> element
        var selectOptions = this.data.getElementsByTagName('select')[0];
        var parentDiv = selectOptions.parentNode;
        parentDiv.replaceChild(cIcon, selectOptions);

        cIcon = null;
        selectOptions = null;
        parentDiv = null;


        this.icon = icon;
    }

    newIconNumber = null;
    tr = null;
    totalIcons = null;
};

/* Change icon colors to specified hex */
piktochart.Chart.prototype.colorChange = function(hex) {
    var totalIcons = this.elem.getElementsByTagName('i');

    for(var i = 0; i < totalIcons.length; i++) {
        totalIcons[i].style.color = hex;
    }

    var cIcon = this.data.getElementsByTagName('i')[0];
    cIcon.style.color = hex;

    totalIcons = null;
};

