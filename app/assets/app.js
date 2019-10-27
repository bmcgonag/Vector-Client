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


// toggle the vpn based on the state of the switch (checkbox).
var onOff = function() {
    let isChecked = document.getElementById("toggleOnOrOff").checked;
    if (isChecked == true) {
        Neutralino.os.runCommand('echo ' + configs.sudo_user_pass + ' | sudo -S wg-quick up ' + configs.wg_interface, 
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
        Neutralino.os.runCommand('echo ' + configs.sudo_user_pass + ' | sudo -S wg-quick down ' + configs.wg_interface,
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

        },
        function() {
            console.error("Error");
        }
    )
}

// check connectivity
var checkConnection = function() {
    Neutralino.os.runCommand('ip addr show ' + configs.wg_interface,
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

// when the app starts, check connectivity and connection status
Neutralino.init({
    load: function () {
        checkConnection();
    }
});

// import a wireguard configuration file
// select the file
var importConfig = function() {
    Neutralino.os.dialogOpen('Open a file..', 
        function (data) {
            // console.log(data);
            mvConfig(data.file);
        },
        function () {
            console.error('error');
        }
    );
}

// read the file
var mvConfig = function(filename_in) {
    let filename = filename_in.replace(/\r?\n|\r/, "");
    // console.log("Filename: " + filename);
    // console.log("------------------------------------");
    // console.log('echo ' + configs.sudo_user_pass + ' | sudo -S cp ' + filename + ' /etc/wireguard/');
    
    Neutralino.os.runCommand('echo ' + configs.sudo_user_pass + ' | sudo -S cp ' + filename + ' /etc/wireguard/',
        function (data) {
            // console.log(data);
        },
        function () {
            console.error('error');
        }
    );
}