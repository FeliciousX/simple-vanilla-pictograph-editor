var data = [];

// Initialize temp data
function init() {
    data.push(new piktochart.Chart('Women', 120, 5, 'women13'));
    data.push(new piktochart.Chart('Dog', 60, 10, 'dog77'));
    data.push(new piktochart.Chart('Cat', 70, 10, 'cat19'));
    data.push(new piktochart.Chart('Brain', 80, 10, 'brain5'));
    data.push(new piktochart.Chart('Dog', 60, 10, 'dog77'));
    data.push(new piktochart.Chart('Dog', 120, 2, 'dog77'));
}

/* Main function to bind them all */
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
    if (typeof(piktochart) == 'undefined') {
        alert('piktochart.js not loaded!');
        return;
    }
    // initialize dummy data
    init();

    // run main
    main();
};
