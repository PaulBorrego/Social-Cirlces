var game = null;
var pickedCircle = null;
var otherColor = "lightblue";
var pickedColor = "teal";

function startGame(characters, noPlays) {
    if (noPlays) {
        countdown();
    } else {
        let parsed_characters = JSON.parse(characters);
        for (let i = 0; i <= 2; i++) {
            let result = '';
            for (let j = 0; j <= 2; j++) {
                result = result + '<p>' + parsed_characters[i * 3 + j].name + '</p>';
            }
            document.getElementById('circle' + i).innerHTML = result;
        }
        document.getElementById("circle0").style.backgroundColor = pickedColor;
    }
}

function ok() {
    fetch('/start-game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.ok) {
            window.location.reload(); // Reload page to reflect game start
        }
});
}

function doAct(action) {
    document.getElementById("circleID").value = pickedCircle;
    document.getElementById("actionID").value = action;
}

function pickCircle(circleNumber) {
    if (pickedCircle != circleNumber) {
        pickedCircle = circleNumber;
        document.getElementById("circle0").style.backgroundColor = otherColor;
        document.getElementById("circle1").style.backgroundColor = otherColor;
        document.getElementById("circle2").style.backgroundColor = otherColor;
        document.getElementById("circle" + circleNumber).style.backgroundColor = pickedColor;
    }
}
var start_hour = new Date().getHours();

function countdown() {
    // code modified from w3 schools countdown example
    setTimeDiff(); // inital call, This makes it so that the countdown is onscreen immediately

    // Update the count down every 1 second
    setInterval(setTimeDiff, 1000);
}    

function setTimeDiff() {
    // Get today's date and time
    var now = new Date();

    // Time calculations for days, hours, minutes and seconds
    var minutes = 59 - now.getMinutes();
    var seconds = 59 - now.getSeconds();

    // Display the result in the element with id="demo"
    document.getElementById("timer").innerHTML = minutes + " minutes and " + seconds + " seconds until plays reset " 

    // If the count down is finished, write some text
    if (start_hour != now.getHours()) {
        document.getElementById("timer").innerHTML = "done";
    }
}

function setColor(color) {
    window.location.href = `/set-color?color=${color}`;
  }  