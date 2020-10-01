$(document).ready(function() {
    // Delete interface from the list of interfaces - this does not remove the interface from 
    // the wireguard interfaces folder.

    $(document).on('click', '#iFaceTbl td', function(event) {
        console.log("Clicked.");
        let intId = event.target.id;
        console.log("ID was: " + intId);
        let Currenthtml = "";
        
        // now read in the values from the interfaceInfo.conf file, and create an array
        // then pop the clicked interface id out of the array, and re-save.
        // also - probably need to put a modal confirmation dialog on this action.
        Neutralino.filesystem.readFile( 'interfaceInfo.conf',
        function (data) {
            intList = data.content;
            intArray = intList.trim().split(',');
            // console.log("Int Array for addInt On Click = " + intArray);
            // console.dir("iFaces = " + intArray);
            let iFaces_count = intArray.length;
            // console.log("length: " + iFaces_count);
            
            // take intId and remove the _trash from it,
            // then remove it from the array.
            let intIdPri = intId.split('_');
            // console.log(intIdPri);
            const index = intArray.indexOf(intIdPri[0]);
            if (index > -1) {
                intArray.splice(index, 1);
                console.log("New array of interfaces: " + intArray);
                // turn our array into a comma separated string
                for (i = 0; i < intArray.length; i++) { 
                    if (i == 0) {
                        newIntFile = intArray[i];
                    } else {
                        newIntFile = newIntFile + "," + intArray[i];
                    }

                    let trashId = intArray[i] + "_trash";
                    let html_to_insert = '<tr><td>' + intArray[i] + '</td><td id=' + trashId + ' class="delInt" style="color: red;">X</td></tr>';
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
            } else {
                console.log("    !!! ***  No Interface found with that name.");
            }
        },
        function () {
            console.error('error');
        }
    );
    });
});
