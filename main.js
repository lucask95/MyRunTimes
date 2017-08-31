class RunTime {
    constructor() {
        this.times = [];
        this.sortedTimes = [];
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
        if (this.occurrances[newTime] == undefined)
            this.occurrances[newTime] = 1;
        else
            this.occurrances[newTime]++;

        // check number of times newest time has occurred. if it has occurred
        // more times than current mode, replace current mean
        if (this.mode == -1 || this.occurrances[newTime] > this.occurrances[this.mode])
            this.mode = newTime;
    }

    findMedian() {
        var len = this.sortedTimes.length;
        // get average of the two middle values if times is an even length
        if (len % 2 == 0)
            this.median = (this.sortedTimes[len / 2] + this.sortedTimes[(len / 2) - 1]) / 2;
        else
            this.median = this.sortedTimes[Math.floor((len) / 2)];
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
        this.sortedTimes.splice(_.sortedIndex(this.times, n), 0, n);
        this.times.push(n);
        this.timesSum += n;
        this.newTime = n;
        this.calcAll();
    }
}

var runTimes = {};
var ctx;
var myChart = {};

// takes string in HH:MM:SS or MM:SS or SS format and returns the value
// in seconds. Ex: processInput("1:12:05.01") returns 4325.01
function processInput(inputString) {
    var timeInSec = 0;
    var splitString = inputString.split(':');

    // some basic checks to see if input is valid
    // probably doesn't catch everything
    for (var i = 0; i < splitString.length; i++) {
        // remove empty strings from list
        if (splitString[i] == "") {
            splitString.splice(i, 1);
            i--;
            continue;
        }

        // check for invalid input
        if (isNaN(Number(splitString[i])))
            return -1;
    }

    // multiplies minutes and hours by the proper values and turns time into sec
    for (var i = 0; splitString.length > 0; i++)
        timeInSec += Number(splitString.pop()) * Math.pow(60, i);

    return timeInSec;
}

// takes time in seconds and returns a string in HH:MM:SS.MS format
function secondsToString(t) {
    var timeString = "";
    timeString += Math.floor(t / 3600); //hours
    t = t % 3600;
    var minutes = Math.floor(t / 60); // minutes
    timeString += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    t = Math.floor(t % 60);
    timeString += (t < 10) ? ":0" + t : ":" + t; // seconds
    return timeString;
}

// updates run time history output as well as run time data output
function updateInfo() {
    $("#timesOut").append("<div class=\"runtime\">" + secondsToString(runTimes.newTime) + "</div>");
    var outputstring = "<ul>" +
        "<li><strong>Worst Time:</strong> " + secondsToString(runTimes.max) + "</li>" +
        "<li><strong>Best Time:</strong> " + secondsToString(runTimes.min) + "</li>" +
        "<li><strong>Mean Time:</strong> " + secondsToString(runTimes.mean) + "</li>" +
        "<li><strong>Median Time:</strong> " + secondsToString(runTimes.median) + "</li>" +
        "<li><strong>Mode Time:</strong> " + secondsToString(runTimes.mode) + "</li>" +
        "</ul>";
    $("#infoOut").html(outputstring);
}

// puts values into localStorage for use on subsequent visits to the page
function updateCookie() {
    for (var key in runTimes)
        localStorage.setItem(key, runTimes[key]);
    localStorage.setItem("occurrances", JSON.stringify(runTimes.occurrances));
}

function insertTime() {
    var inputString = $("#timeIn").val();
    $("#timeIn").val("");
    var newTime = processInput(inputString);
    if (newTime == -1) {
        alert("Invalid character in input.");
        return;
    }
    runTimes.push(newTime);
    console.log(runTimes.times);
    updateInfo();
}

// retrieves values from localStorage so that user can continue
// from where they left off
function initializeObject() {
    runTimes = new RunTime();

    // if there is nothing in localStorage, then start with a new object
    if (!(localStorage.getItem("timesSum")))
        return;

    // get data from localStorage
    for (var key in runTimes) {
        // if the value can be parsed to a number, do so when getting the value,
        // otherwise, just get the string
        runTimes[key] = Number(localStorage.getItem(key)) ?
            Number(localStorage.getItem(key)) : localStorage.getItem(key);
    }

    // parse times & occurrances
    runTimes.sortedTimes = runTimes.times.split(',').map(Number);
    runTimes.times = runTimes.times.split(',').map(Number);
    runTimes.occurrances = JSON.parse(String(runTimes.occurrances));

    // output run history except for most recent run, which will be appended
    // after calling updateInfo()
    for (var i = 0; i < runTimes.times.length; i++) {
        if (i < runTimes.times.length - 1)
            $("#timesOut").append("<div class=\"runtime\">" +
                secondsToString(runTimes.times[i]) + "</div>");
    }

    updateInfo();
}

function updateChart() {
    /*
    console.log(runTimes.times);
    var tempData =  _.cloneDeep(runTimes.times);
    var tempLabels = [];
    for (var i = 0; i < runTimes.times.length; i++)
        tempLabels.push(String(i+1));

    myChart.data.datasets[0].data = tempData;
    myChart.labels = tempLabels;
    myChart.update();
    */
}

function drawChart() {
    // initialize values that chart uses
    var tempData = _.cloneDeep(runTimes.times);
    var tempLabels = [];
    for (var i = 0; i < runTimes.times.length; i++)
        tempLabels.push(String(i+1));

    // initialize chart with data
    ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: tempLabels,
            datasets: [{
                label: "Run Time History",
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgb(66, 138, 255)',
                data: tempData,
            }]
        },
        options: {}
    });
}

$(document).ready(function() {
    initializeObject();
    drawChart();
    $("#goBtn").click(insertTime);
    $("#goBtn").click(updateChart);
    $("#timeIn").keypress(function(e) {
        if (e.keyCode == 13) {
            insertTime();
            updateChart();
        }
    });
    $(window).bind("beforeunload", updateCookie);
    console.log(runTimes.times);
});

// TODO: Allow for different categories of times (like 1 mile, 13 mile, 26 mile)
// TODO: Display time history in graph. Possible libraries to use:
//     chartjs: http://www.chartjs.org/docs/latest/getting-started/
//     dimplejs: http://dimplejs.org/
