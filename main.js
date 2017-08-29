class RunTime {
    constructor() {
        this.times = [];
        this.max = -1;
        this.min = -1;
        this.mean = -1;
        this.median = -1;
        this.mode = -1;
    }

    push(n) {
        this.times.push(n);
        calcAll();
    }

    calcAll() {

    }
}

var runTimes = {};

// takes string in HH:MM:SS.MS or MM:SS.MS or SS.MS format and returns the value
// in seconds. Ex: processInput("1:12:05.01") returns 4325.01
function processInput(inputString) {
    var timeInSec = 0;
    var splitString = inputString.split(':');
    for (var i = 0; splitString.length > 0; i++)
        timeInSec += Number(splitString.pop()) * Math.pow(60, i);
    return timeInSec;
}

function insertTime() {
    var inputString = $("#timeIn").val();
    var newTime = processInput(inputString);
    runTimes.push(newTime);
    updateInfo();
}

function initialize() {
    runTimes = new RunTime();
}

$(document).ready(function(){
    initialize();
    $("#goBtn").click(insertTime);
    $("#timeIn").keypress(function(e) { if (e.keyCode == 13) insertTime(); });
});
