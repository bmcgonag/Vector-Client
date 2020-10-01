// **************************************************************
//
// This file handles saving the settings for the Vector client.
//
// **************************************************************

var saveSettings = function() {
    let pwSet = $("#suPw").val();
    if (pwSet == null || pwSet == "") {
        alert('You must enter a value in Password in order to save.');
    } else {
        // console.log("PW Entered is: " + pwSet);
        // Now let's save our updated value to our configuration file.
        let supword = "sudopw:" + pwSet;
        Neutralino.filesystem.writeFile('pwInfo.conf', supword,
            function(data) {
                // console.log("Successful save.");
            },
            function() {
                // console.log("Error updating sudo pw: " + error);
            }
        );
    }
}