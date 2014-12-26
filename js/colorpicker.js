/* Converts base-10 to hex */
piktochart.helper.toHex = function(n) {
    // convert n to base 10
    n = parseInt(n,10);

    // if not a number, return 00
    if(isNaN(n)) return "00";

    // make sure we get the value from 0 - 255
    n = Math.max(0,Math.min(n,255));

    // convert to base-16 manually.
    // For the ^1 part...
    // n % 16 always gets u 0 - 15 (for the ^1)
    // 
    // For the ^2 part...
    // (n - n % 16) ensures that it's always factor of 16.
    // Then divide it by 16 to find out how many times has it exceeded 16.
    var base16 = "0123456789ABCDEF";
    var pow1 = base16.charAt(n%16);
    var pow2 = base16.charAt((n-n%16)/16);

    return pow2 + pow1;
};

/* Get R G B and convert them to hexadecimal form */
piktochart.helper.rgbToHex = function(R, G, B) {
    return "#"
        + piktochart.helper.toHex(R)
        + piktochart.helper.toHex(G)
        + piktochart.helper.toHex(B);
};

/* Canvas onlick function to get rgb value */
piktochart.helper.getCanvasColorValue = function(e) {
    var canvas = document.getElementById('colorPicker').getContext('2d');

    // getting coordinates
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;

    // getting image data and RGB values
    // get the image data from coordinate (x, y) with 1 pixel
    var imgData = canvas.getImageData(x, y, 1, 1).data;
    var R = imgData[0];
    var G = imgData[1];
    var B = imgData[2];

    // convert RGB to HEX
    var hex = piktochart.helper.rgbToHex(R, G, B);

    piktochart.helper.changeCurrentChartColor(hex);
};

