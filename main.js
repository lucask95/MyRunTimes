$(document).ready(function(){
    $("#goBtn").click(insertTime);
    $("#timeIn").keypress(function(e) { if (e.keyCode == 13) insertTime(); });
});

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

// should be able to process inputs such as 1h12m5s100ms, 5m2s, 1:12:05.1, 5:02
function processInput(inputString) {
    var timeInMs = 0;
    var delims = ['h', 'm', 's', 'ms', ':'];
    var timeNumbers = [];

    for (var i = delims.length - 1; i >= 0; i--) {
        var splitString = inputString.split(delims[i]);
        while (splitString.length > 0) {
            var tempString = splitString.pop();
        }
    }

    return timeInMs;
}

function insertTime() {
    var inputString = $("#timeIn").val();
}
