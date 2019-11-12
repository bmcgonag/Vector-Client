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


// ****    toggle the vpn based on the state of the switch (checkbox).
var onOff = function() {
    let isChecked = document.getElementById("toggleOnOrOff").checked;
    let interfaceValue = document.querySelector('#selectInterface option:checked').textContent;
    if (isChecked == true) {
        Neutralino.os.runCommand('echo ' + configs.sudo_user_pass + ' | sudo -S wg-quick up ' + interfaceValue, 
            function (data) {
                // console.log("Data from bringing up Wireguard Interface: ");
                // console.dir(data);
                checkConnection();
            },
            function () {
                console.error('error');
            }
        );
    } else {
        Neutralino.os.runCommand('echo ' + configs.sudo_user_pass + ' | sudo -S wg-quick down ' + interfaceValue,
            function(data) {
                // console.log("Data from taking down Wireguard Interface: ");
                // console.dir(data);
                checkConnection();
            },
            function() {
                console.error('error');
            }
        );
    }
}

var getIpAddress = function() {
    console.log("About to check thte public IP.");
    Neutralino.os.runCommand('dig +short myip.opendns.com @resolver1.opendns.com',
        function(data) {
            // console.log("Got data back: " + data.stdout);
            let ipAddress = data.stdout;
            document.getElementById('output').innerText = ipAddress;
            buildIfaceList();
        },
        function() {
            console.error("Error");
        }
    )
}

// ****    check connectivity
var checkConnection = function() {
    Neutralino.os.runCommand('ip addr show ' + configs.wg_interface[0],
        function(data) {
            let info = data.stdout;
            let inetStart = info.search('inet');

            if (inetStart >= 0) {
                let checkMark = document.getElementById("checkMark");
                checkMark.style.display = "block";
                document.getElementById("toggleOnOrOff").checked = true;

                let exx = document.getElementById("exx");
                exx.style.display = "none";
                getIpAddress();
            } else {
                let checkMark = document.getElementById("checkMark");
                checkMark.style.display = "none";

                let exx = document.getElementById("exx");
                exx.style.display = "block";
                getIpAddress();
            }
        },
        function() {
            console.error('error');
        }
    )
}

// ****    build select list for interfaces
var buildIfaceList = function () {
    // ****    get data from config.js wg_interface array
    let iFaces = configs.wg_interface;
    // console.log(iFaces);

    // ****    find how many elements in the array
    let iFaces_count = iFaces.length;
    // console.log("INterface Count = " + iFaces_count);

    // ****    loop through elements and add them to the selection window
    for (i=0; i < iFaces_count; i++) {
        var x = document.getElementById("chooseIface");
        var option = document.createElement("option");
        option.text = iFaces[i];
        x.add(option);
    }
}

// ****    when the app starts, check connectivity and connection status
Neutralino.init({
    load: function () {
        checkConnection();
    }
});

// ****    import a wireguard configuration file
// ****    select the file
var importConfig = function() {
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
                    addInterfaceToList(interface, data.file);
                }
            }
        },
        function () {
            console.error('error');
        }
    );
}

var addInterfaceToList = function(interface, dataFile) {
    console.log("sed -i 's/]/,\"" + interface + "\" &/g' ./config.js");
            Neutralino.os.runCommand("echo " + configs.sudo_user_pass + " | sudo -S sed -i 's/]/,\"" + interface + "\"&/g' /opt/WiregUIrd/app/assets/config.js",
                function (data) {
                    console.log(data.stdout);
                    buildIfaceList();
                }, 
                function () {
                    console.error("error");
                }
            );
            mvConfig(dataFile);
}

// ****    read the file
var mvConfig = function(filename_in) {
    // ****    move this to the calling function and set it as a session variable
    let filename = filename_in.replace(/\r?\n|\r/, "");

    let didNameChange = localStorage.getItem("changedInterface");
    let newName = localStorage.getItem("newFileName");

    if (didNameChange == "yes") {
        console.log("Changing the interface name on copy:");
        console.log('echo ' + configs.sudo_user_pass + ' | sudo -S cp ' + filename + ' /etch/wireguard/' + newName + '.conf');

        Neutralino.os.runCommand('echo ' + configs.sudo_user_pass + ' | sudo -S cp ' + filename + ' /etch/wireguard/' + newName + '.conf', 
            function(data) {
                // console.log(data);
            },
            function() {
                console.error('error');
            }
        );
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
    let interfaceValue = document.querySelector('#selectInterface option:checked').textContent;
    console.log("Interface Selected: " + interfaceValue);
}

// ****    If the user enters a new interface name during import - get it
var changeInterfaceName = function(newName) {
    console.log("Interface name would now be: " + newName);

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
    // simply copy the interface to the location.
    let myModal = document.getElementById("changeInterfaceModal");
    myModal.style.display = "none";
    mvConfig(filename);
}

spanClick.onclick = function() {
    let myModal = document.getElementById("changeInterfaceModal");
    myModal.style.display = "none";
}
