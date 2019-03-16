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
    var trainFrequency = $("#frequency-input").val().trim();

    var newTrain = {
        name: trainName,
        destination: trainDestination,
        first: trainFirst,
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
    var firstTrain = childSnapshot.val().first;
    var trainFrequency = childSnapshot.val().frequency;
    var nextArrival = "In Test";
    var minutesAway = "In Test";
    var prettyFirstTrain = moment(firstTrain, "HH:mm");
    
    if (!moment(prettyFirstTrain).isValid() || !Number.isInteger(parseInt(trainFrequency))) {
        //do not display the info due to bad data
        $("#first-train-input").val("");
        $("#frequency-input").val("");
        alert("Invalid Input:" + firstTrain + ", " + trainFrequency);
    }
    else {
        //display the info
        
        while (moment().diff(prettyFirstTrain) > 0) {
            prettyFirstTrain = moment().add(trainFrequency, 'm');
            if (moment().diff(prettyFirstTrain) < 0) {
                console.log("detected case where we added frequency and its now arriving soon");
                nextArrival = prettyFirstTrain.format("hh:mm A");
                minutesAway = moment().to(prettyFirstTrain);
                break;
            }
            else {
                prettyFirstTrain = moment().add(trainFrequency, 'm');
            }
        }

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