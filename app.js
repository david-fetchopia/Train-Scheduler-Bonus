// Initialize Firebase
var config = {
    apiKey: "AIzaSyC5-QaEFDfHBaydwx_wXnMTRlKyQIqiUnw",
    authDomain: "train-scheduler-project-a2bf3.firebaseapp.com",
    databaseURL: "https://train-scheduler-project-a2bf3.firebaseio.com",
    projectId: "train-scheduler-project-a2bf3",
    storageBucket: "train-scheduler-project-a2bf3.appspot.com",
    messagingSenderId: "49622901863"
};
firebase.initializeApp(config);
var database = firebase.database();

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainFirst = $("#first-train-input").val().trim();
    var firstTrainHour = trainFirst.split(":")[0];
    var firstTrainMinute = trainFirst.split(":")[1];
    var trainFrequency = $("#frequency-input").val().trim();

    var newTrain = {
        name: trainName,
        destination: trainDestination,
        firstTrainHour: firstTrainHour,
        firstTrainMinute: firstTrainMinute,
        frequency: trainFrequency
    }
    database.ref('records/').push(newTrain);
    alert("Train successfully added");

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");

});

//function to display time calculations, use moment JS
database.ref('records/').on("child_added", function (childSnapshot) {

    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrainHour = childSnapshot.val().firstTrainHour;
    var firstTrainMinute = childSnapshot.val().firstTrainMinute;
    var trainFrequency = parseInt(childSnapshot.val().frequency);
    
    var moment_firstTrain = moment().set({ 'hour': firstTrainHour, 'minute': firstTrainMinute });
    
    var nextArrival = "In Test";
    var minutesAway = "In Test";

    if (!moment(moment_firstTrain).isValid() || !Number.isInteger(trainFrequency)) {
        //do not display the info due to bad data
        alert("Invalid Input(s)");
    }
    else {
        //display the info
        //update first train to be the next arrival
        while (moment_firstTrain.diff(moment()) < 0) {
            moment_firstTrain = moment_firstTrain.add(trainFrequency, 'm');
        }

        nextArrival = moment_firstTrain.format("hh:mm A");
        minutesAway = moment().to(moment_firstTrain);

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDestination),
            $("<td>").text(trainFrequency),
            $("<td>").text(nextArrival),
            $("<td>").text(minutesAway)
        );
        $("#train-table > tbody").append(newRow);
    }
});

$(document).ready(function(){
    
    (function(){
        setInterval(function(){
            document.querySelector("#display").innerHTML = "Current Time: " + moment().format("hh:mm:ss A");
        }, 1000);
        setInterval(function(){
            window.location.reload();
        },60000);
    })();
    
});



