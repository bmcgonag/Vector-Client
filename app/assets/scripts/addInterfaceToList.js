// ****    This function adds manually entered, or imported, interface names to the lists.
var addInterfaceToList = function(interface, dataFile) {
    let newIntFile = "";
    // console.log("");
    // console.log("    ----    Inside Add Interface To List Function.");
    try {
        // get the current interface array
        let intList = localStorage.getItem("interfaceArray");
        // console.log("-----------------------------------");
        // console.log("intList = " + intList);
        intListStripSpaces = intList.trim();
        intArray = intList.split(',');
        // console.log("  ****  Int Array is now: " + intArray);

        let Currenthtml = "";
        let iFaceTbl = document.getElementById("iFaceTbl");

        // add the new interface to the end of the array
        intArray.push(interface);

        // console.log("Updated Interface List: " + intArray);
        // console.log("-- New Int Array Length: " + intArray.length);

        // turn our array into a comma separated string
        for (i = 0; i < intArray.length; i++) { 
            if (i == 0) {
                newIntFile = intArray[i];
            } else {
                newIntFile = newIntFile + "," + intArray[i];
            }

            let trashId = intArray[i] + "_trash";
            let html_to_insert = '<tr><td>' + intArray[i] + '</td><td id=' + trashId + ' class="delInt">X</td></tr>';
            Currenthtml = Currenthtml + html_to_insert;
            // console.log(" - - " + [i] + " - " + Currenthtml);

            // console.log("New Int File: " + newIntFile);
            if (i == intArray.length-1) {
                // write the new values out to our config file.
                localStorage.setItem("interfaceArray", newIntFile);
                Neutralino.filesystem.writeFile('interfaceInfo.conf', newIntFile,
                    function (data) {
                        console.log(data);
                    },
                    function () {
                        console.error('error');
                    }
                );

                // console.log("-##---##-  It's equal!");
                iFaceTbl.innerHTML = Currenthtml;
            }
        }

        buildIfaceList();
    } catch (err) {
        console.log("Error: " + err.name + " - " + err.message);
    }
    if (dataFile != "manual") {
        mvConfig(dataFile);
    }
}