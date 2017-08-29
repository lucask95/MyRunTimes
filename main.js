// update this class so that array is sorted as values are inserted
class RunTime {
    constructor() {
        this.times = [];
        this.max = -1;
        this.min = -1;
        this.mean = -1;
        this.median = -1;
        this.mode = -1;

        // extra variables for helping calculate values
        this.occurrances = {}; // helps with mode
        this.newTime = 0; // helps with max, min, mode
        this.timesSum = 0; // helps with mean
    }

    findMax() {
        if (this.newTime > this.max)
            this.max = this.newTime;
    }

    findMin() {
        if (this.min == -1 || this.newTime < this.min)
            this.min = this.newTime;
    }

    calcMean() {
        this.mean = this.timesSum / this.times.length;
    }

    findMode() {
        var newTime = this.newTime;

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
        this.median = this.times[Math.floor((this.times.length)/2)];
    }

    calcAll() {
        this.findMax();
        this.findMin();
        this.calcMean();
        this.findMedian();
        this.findMode();
    }

    push(n) {
        // inserts value so array stays sorted during insert. helps with median
        this.times.splice(_.sortedIndex(this.times, n), 0, n);
        this.timesSum += n;
        this.newTime = n;
        this.calcAll();
    }
}

var runTimes = {};

// takes string in HH:MM:SS or MM:SS or SS format and returns the value
// in seconds. Ex: processInput("1:12:05.01") returns 4325.01
function processInput(inputString) {
    var timeInSec = 0;
    var splitString = inputString.split(':');
    for (var i = 0; splitString.length > 0; i++)
        timeInSec += Number(splitString.pop()) * Math.pow(60, i);
    return timeInSec;
}

// takes time in seconds and returns a string in HH:MM:SS.MS format
function secondsToString(t) {
    var timeString = "";
    timeString += Math.floor(t/3600); //hours
    t = t % 3600;
    var minutes = Math.floor(t/60); // minutes
    timeString += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    t = Math.round(t % 60);
    timeString += (t < 10) ? ":0" + t : ":" + t; // seconds
    return timeString;
}

function updateInfo() {
    $("#timesOut").append("<div class=\"runtime\">"+secondsToString(runTimes.newTime)+"</div>");
    var outputstring = "<ul>" +
        "<li>Worst Time: " + secondsToString(runTimes.max) + "</li>" +
        "<li>Best Time: " + secondsToString(runTimes.min) + "</li>" +
        "<li>Mean Time: " + secondsToString(runTimes.mean) + "</li>" +
        "<li>Median Time: " + secondsToString(runTimes.median) + "</li>" +
        "<li>Mode Time: " + secondsToString(runTimes.mode) + "</li>" +
        "</ul>";
    $("#infoOut").html(outputstring);
}

function insertTime() {
    var inputString = $("#timeIn").val();
    $("#timeIn").val("");
    var newTime = processInput(inputString);
    runTimes.push(newTime);
    updateInfo();
}

$(document).ready(function(){
    runTimes = new RunTime();
    $("#goBtn").click(insertTime);
    $("#timeIn").keypress(function(e) { if (e.keyCode == 13) insertTime(); });
});
