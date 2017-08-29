class RunTime {
    constructor() {
        this.times = [];
        this.max = -1;
        this.min = -1;
        this.mean = -1;
        this.median = -1;
        this.mode = -1;

        // extra variables for helping calculate values
        this.occurrances = {};
        this.timesSum = 0;
    }

    findMax() {
        var newTime = this.times[this.times.length-1];
        if (newTime > this.max)
            this.max = newTime;
    }

    findMin() {
        var newTime = this.times[this.times.length-1];
        if (this.min == -1 || newTime < this.min)
            this.min = newTime;
    }

    calcMean() {
        this.mean = this.timesSum / this.times.length;
    }

    findMode() {
        var newTime = this.times[this.times.length-1];

        // update key value pair
        if(this.occurrances[newTime] == undefined)
            this.occurrances[newTime] = 1;
        else
            this.occurrances[newTime]++;

        // check number of times newest time has occurred. if it has occurred
        // more times than current mode, replace current mean
        if (this.mode == -1 || this.occurrances[newTime] > this.occurrances[this.mode])
            this.mode = newTime;
    }

    findMedian() {
        this.times.sort();
        this.median = Math.floor(this.times.length);
    }

    calcAll() {
        this.findMax();
        this.findMin();
        this.calcMean();
        this.findMode();
        this.findMedian();
    }

    push(n) {
        this.times.push(n);
        this.timesSum += n;
        this.calcAll();
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

function updateInfo() {

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
