/* Global namespace */
var PIKTOCHART = PIKTOCHART || {};
/* Constant variables */
PIKTOCHART.SVG_NS = 'http://www.w3.org/2000/svg';
PIKTOCHART.XLINK_NS = 'http://www.w3.org/1999/xlink';

/**
 * @public
 * @constructor
 * @param label String for chart label
 * @param value int for the value of chart
 * @param ratio int the ratio of icons to value
 * @param icon String name of icon chosen
 */
PIKTOCHART.Chart = function (label, value, ratio, icon) {
    this.label = label;
    this.value = value;
    this.ratio = ratio;
    this.icon = icon;
    this.iconNumber = this.value / this.ratio;
}

/**
 * Generates the HTML code for the chart
 * @public
 * @return the function to append new chart
 */
PIKTOCHART.Chart.prototype.generateChart = function() {
    var chart = null;
    var icons = null;
    var chartIcon = null;
    var label = null;
    var labelText = null;

    // Appends a new chart with id to .group-content
    return function(id, editorContent) {
        chart = document.createElement('content');
        chart.id = 'data' + id;

        icons = document.createElement('div');
        icons.className = 'icons';

        chartIcon = document.createElement('i');
        chartIcon.className = 'chart-icon ' + 'flaticon-' + this.icon;

        label = document.createElement('div');
        label.className = 'label';

        labelText = document.createElement('p');
        labelText.className = 'label-text';

        editorContent.appendChild(chart);
        chart.appendChild(icons);

        for (var j = 0; j < this.iconNumber; j++) {
            icons.appendChild(chartIcon.cloneNode(true));
        }

        chart.appendChild(label);

        label.appendChild(labelText);
        labelText.appendChild(document.createTextNode(this.label));

        chart = null;
        icons = null;
        label = null;
        labelText = null;
        chartIcon = null;
    };
}

var data = [];

// Initialize temp data
function init() {
    data.push(new PIKTOCHART.Chart('Women', 120, 10, 'women13'));
    data.push(new PIKTOCHART.Chart('Dog', 60, 10, 'dog77'));
    data.push(new PIKTOCHART.Chart('Cat', 70, 10, 'cat19'));
    data.push(new PIKTOCHART.Chart('Brain', 80, 10, 'brain5'));
}

/* Run programme */
function main() {
    var editorContent = document.getElementById('editorContent');
    var chart = null;
    for (var i = 0; i < data.length; i++) {
        chart = data[i].generateChart();
        chart(i, editorContent);
        chart = null;
    }
    editorContent = null;
}

window.onload = function() {
    init();
    main();
};

