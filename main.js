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
    }

    calcAll() {

    }
}

var runTimes = {};

// should be able to process inputs in HH:MM:SS format, may omit HH: or HH:MM
function processInput(inputString) {
    var timeInMs = 0;
    var splitString = inputString.split(':');
    return timeInMs;
}

function insertTime() {
    var inputString = $("#timeIn").val();
    var newTime = processInput(inputString);
}

function initialize() {
    runTimes = new RunTime();
}

$(document).ready(function(){
    processInput("1h12m5s");
    initialize();
    $("#goBtn").click(insertTime);
    $("#timeIn").keypress(function(e) { if (e.keyCode == 13) insertTime(); });
});
