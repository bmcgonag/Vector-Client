// MIT License

// Copyright (c) 2018 Neutralinojs

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// ****    build select list for interfaces
var buildIfaceList = function () {
    let intArray = [];
    console.log("");
    console.log("    ----    Inside Build Interface List function");

    // first we'll remove the options from the drop-down then rebuild it
    let iFaceList = document.getElementById("chooseIface");

    while (iFaceList.options.length != 0) {
        iFaceList.options.remove(iFaceList.options.length - 1);
    }

    Neutralino.filesystem.readFile("interfaceInfo.conf",
        function(data) {
            intArray = data.content.trim().split(',');
            console.log("--- line 172 --- Int Array: " + intArray);
            localStorage.setItem("interfaceArray", intArray);

            console.log(" - Interfaces are:");
            console.log(intArray);
            let iFaces = intArray;

            // ****    find how many elements in the array
            let iFaces_count = iFaces.length;
            console.log("Interface Count = " + iFaces_count);

            // ****    loop through elements and add them to the selection window
            for (i=0; i < iFaces_count; i++) {
                var x = document.getElementById("chooseIface");
                var option = document.createElement("option");
                option.text = iFaces[i];
                x.add(option);
            }
        },
        function() {
            console.log("Error: " + error);
        }
    );
    return;
}

// ****    when the app starts, check connectivity and connection status
Neutralino.init({
    load: function () {
        checkConnection("start");
    }
});

// ****    import a wireguard configuration file
// ****    select the file
var importConfig = function() {
    console.log("");
    console.log("    ----    Inside Import Configuration function");
    Neutralino.os.dialogOpen('Open a file..', 
        function (data) {
            // console.log("--------------------");
            // console.log(data.file);
            // console.log("--------------------");
            let lastPart = data.file.split("/").pop();
            let interface = lastPart.substr(0, lastPart.indexOf('.'));
            // console.log("Interface name: " + interface);

            if (typeof(Storage) !== "undefined") {
                // Store
                localStorage.setItem("filepathAndName", data.file);
                localStorage.setItem("pathOnly", data.file.substr(0, data.file.lastIndexOf("/")));
                localStorage.setItem("filenameOnly", lastPart);
                localStorage.setItem("interfaceName", interface);
            }
            
            // ****    compare last part to existing interfaces to avoid duplicates
            let iFaces = configs.wg_interface;
            let ifaceCount = iFaces.length;
            console.log("Interface Count for dups: " + ifaceCount);
            
            for (i=0; i<ifaceCount; i++) {
                if (iFaces[i] == interface) {
                    // console.log("The selected interface matches an existing interface.");
                    // ****    call pop-up message to ask if the user wants to change the name.
                    document.getElementById("changeInterfaceModal").style.display = "block";
                } else {
                    console.log("No matching interface found.");
                }
            }
        },
        function () {
            console.error('error');
        }
    );
}

var addInterfaceToList = function(interface, dataFile) {
    let newIntFile = "";
    console.log("");
    console.log("    ----    Inside Add Interface To List Function.");
    try {
        // get the current interface array
        let intList = localStorage.getItem("interfaceArray");
        console.log("-----------------------------------");
        console.log("intList = " + intList);
        intListStripSpaces = intList.trim();
        intArray = intList.split(',');
        console.log("  ****  Int Array is now: " + intArray);

        let Currenthtml = "";
        let iFaceTbl = document.getElementById("iFaceTbl");

        // add the new interface to the end of the array
        intArray.push(interface);

        console.log("Updated Interface List: " + intArray);
        console.log("-- New Int Array Length: " + intArray.length);

        // turn our array into a comma separated string
        for (i = 0; i < intArray.length; i++) { 
            if (i == 0) {
                newIntFile = intArray[i];
            } else {
                newIntFile = newIntFile + "," + intArray[i];
            }

            let html_to_insert = '<tr><td>' + intArray[i] + '</td><td><span class="fa fa-trash"></span></td></tr>';
            Currenthtml = Currenthtml + html_to_insert;
            console.log(" - - " + [i] + " - " + Currenthtml);

            console.log("New Int File: " + newIntFile);
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

                console.log("-##---##-  It's equal!");
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

// ****    read the file
var mvConfig = function(filename_in) {
    console.log("");
    console.log("    ----    Inside Move file function");
    // ****    move this to the calling function and set it as a session variable
    let filename = filename_in.replace(/\r?\n|\r/, "");

    let didNameChange = localStorage.getItem("changedInterface");
    let newName = localStorage.getItem("newFileName");

    if (didNameChange == "yes") {
        console.log("Changing the interface name on copy:");
        console.log('echo ' + configs.sudo_user_pass + ' | sudo -S cp ' + filename + ' /etc/wireguard/' + newName + '.conf');

        Neutralino.os.runCommand('echo ' + configs.sudo_user_pass + ' | sudo -S cp ' + filename + ' /etc/wireguard/' + newName + '.conf', 
            function(data) {
                console.log(data.stdout);
            },
            function() {
                console.error('error');
            }
        );
        localStorage.setItem("changedInterface", "no");
    } else {
        // console.log('echo ' + configs.sudo_user_pass + ' | sudo -S cp ' + filename + ' /etc/wireguard/');
        
        // ****    get the re-written filename to use if necessary

        Neutralino.os.runCommand('echo ' + configs.sudo_user_pass + ' | sudo -S cp ' + filename + ' /etc/wireguard/',
            function(data) {
                // console.log(data);
            },
            function() {
                console.error('error');
            }
        );
    }
}

// ****    get the value chosen by the user in the drop down
var getValueChosen = function() {
    console.log("");
    console.log("    ----    Inside Get New Interface Name Value function");
    let interfaceValue = document.querySelector('#selectInterface option:checked').textContent;
    console.log("Interface Selected: " + interfaceValue);
    let sel = document.getElementById('chooseIface');

    // TODO
    // why am i doing the line below?  I don't know
    let interfaceIndex = sel.selectedIndex;
    
    localStorage.setItem("selIndex", interfaceValue);
}

// ****    If the user enters a new interface name during import - get it
var changeInterfaceName = function(newName) {
    console.log("");
    console.log("    ----    Inside Change Interface Name function");
    console.log("")
    console.log(" - Interface name would now be: " + newName);

    // get the values from the session storage to use
    let filePathAndName = localStorage.getItem("filepathAndName");
    let pathOnly = localStorage.getItem("pathOnly");
    let filenameOnly = localStorage.getItem("filenameOnly");
    let interfaceName = localStorage.getItem("interfaceName");

    // create the new file path to copy to
    localStorage.setItem("newFileName", newName);
    localStorage.setItem("changedInterface", "yes");

    // console.log("pathOnly = " + pathOnly);
    // console.log("filenameOnly = " + filenameOnly);

    // now create the new Interface with it's new name
    addInterfaceToList(newName, filePathAndName);
}

// ****    Handle different option button clicks on modal
var yesBtn = document.getElementById("change");
var noBtn = document.getElementById("noChange");
var spanClick = document.getElementById("closeModal");

yesBtn.onclick = function() {
    console.log("");
    console.log("    ----    Inside Clicked Yes function");
    let newName = document.getElementById("newIfaceName").value;
    if (newName == "" || newName == null) {
        // turn the background of the field red and text of the field white
        let myIfaceName = document.getElementById("newIfaceName");
        myIfaceName.style.border = "3px solid red";
    } else {
        // call the change interface name function and pass it the newName value
        let myModal = document.getElementById("changeInterfaceModal");
        myModal.style.display = "none";
        changeInterfaceName(newName);
    }
}

noBtn.onclick = function() {
    console.log("");
    console.log("    ----    Inside Clicked No function");
    // simply copy the interface to the location.
    let filename = localStorage.getItem("filenameOnly");
    let myModal = document.getElementById("changeInterfaceModal");
    myModal.style.display = "none";
    mvConfig(filename);
}

spanClick.onclick = function() {
    console.log("");
    console.log("    ----    Inside Close Modal without Selection fo Yes / No function");
    let myModal = document.getElementById("changeInterfaceModal");
    myModal.style.display = "none";
}

addInt.onclick = function() {
    console.log("Clicked Add Interface Page");
    let connPage = document.getElementById("connectPage");
    let addInterface = document.getElementById("addInterfacePage");
    let settPage = document.getElementById("settingsPage");
    let importIFace = document.getElementById("importInterface");
    settPage.style.display = "none";
    addInterface.style.display = "block";
    connPage.style.display = "none";
    importIFace.style.display = "none";
    let Currenthtml = "";
    let intArray = [];

    // remove interface table, and rebuild to make sure we have the correct (most up to date) list of interfaces
    var iFaceTbl = document.getElementById("iFaceTbl");

    // now build our table body
    Neutralino.filesystem.readFile( 'interfaceInfo.conf',
        function (data) {
            intList = data.content;
            intArray = intList.trim().split(',');
            console.log("Int Array for addInt On Click = " + intArray);
            console.dir("iFaces = " + intArray);
            let iFaces_count = intArray.length;
            console.log("length: " + iFaces_count);
            for (i=0; i < iFaces_count; i++) {
                console.log("trying to add interface for: " + intArray[i]);
                let html_to_insert = '<tr><td>' + intArray[i] + '</td><td><span class="fa fa-trash"></span></td></tr>';
                Currenthtml = Currenthtml + html_to_insert;
                console.log(" - - " + [i] + " - " + Currenthtml);
                if (i == iFaces_count-1) {
                    console.log("it's equal!");
                    iFaceTbl.innerHTML = Currenthtml;
                }
            }
        },
        function () {
            console.error('error');
        }
    );
}

connectPg.onclick = function() {
    console.log("Clicked Connect Page");
    let connPage = document.getElementById("connectPage");
    let addInterface = document.getElementById("addInterfacePage");
    let settPage = document.getElementById("settingsPage");
    let importIFace = document.getElementById("importInterface");
    settPage.style.display = "none";
    connPage.style.display = "block";
    addInterface.style.display = "none";
    importIFace.style.display = "none";
}

var addNewInt = function() {
    let newInt = document.getElementById("exInterfaceName").value;
    let input = document.getElementById("exInterfaceName");
    input.innerHTML = '';
    console.log("about to add interface to list: " + newInt);

    addInterfaceToList(newInt, "manual");
}

settings.onclick = function() {
    console.log("clicked Settings page.");
    let connPage = document.getElementById("connectPage");
    let addInterface = document.getElementById("addInterfacePage");
    let settPage = document.getElementById("settingsPage");
    let importIFace = document.getElementById("importInterface");
    settPage.style.display = "block";
    connPage.style.display = "none";
    addInterface.style.display = "none";
    importIFace.style.display = "none";
}

importInterfaceIcon.onclick = function() {
    console.log("clicked import interface icon.");
    let connPage = document.getElementById("connectPage");
    let addInterface = document.getElementById("addInterfacePage");
    let settPage = document.getElementById("settingsPage");
    let importIFace = document.getElementById("importInterface");
    settPage.style.display = "none";
    connPage.style.display = "none";
    addInterface.style.display = "none";
    importIFace.style.display = "block";
}
