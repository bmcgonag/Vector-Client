// ****    toggle the vpn based on the state of the switch (checkbox).
var onOff = function() {
    console.log("");
    console.log("    ----    Inside Toggle On / Off function");
    let isChecked = document.getElementById("toggleOnOrOff").checked;
    let interfaceValue = document.querySelector('#chooseIface option:checked').textContent;
    if (interfaceValue == null || typeof interfaceValue == 'undefined') {
        interfaceValue = document.querySelector('#chooseIface option:checked').textContent;
    }
    console.log("Interface from UI: " + interfaceValue);

    localStorage.setItem("selIndex", interfaceValue);
    var checkSpeed = null;
    let downspeed = 0;
    let downspeed1 = 0;
    let downspeedTot = 0;
    let upspeed = 0;
    let upspeed1 = 0;
    let upspeedTot = 0;

    Neutralino.filesystem.readFile('pwInfo.conf',
        function(data) {
            let pwfile = data.content;
            let pwarray = pwfile.split(':');
            let pw = pwarray[1].trim();
            console.log("pw is: " + pw);

            // alert("Interface Value: " + interfaceValue);
            console.log("Interface Value: " + interfaceValue);
            console.log("Command is ----------------------------------: ");
            console.log('echo ' + pw + ' | sudo -S wg-quick up ' + interfaceValue);
            console.log('echo ' + configs.sudo_user_pass + ' | sudo -S wg-quick up ' + interfaceValue);
            if (isChecked == true) {
                Neutralino.os.runCommand('echo ' + pw + ' | sudo -S wg-quick up ' + interfaceValue, 
                    function (data) {
                        console.log("");
                        console.log("");
                        console.log("Data from bringing up Wireguard Interface: ");
                        console.dir(data);
                        console.log("");
                        console.log("");

                        checkConnection("toggle");
                    },
                    function () {
                        console.error('error');
                    }
                );
            } else {
                Neutralino.os.runCommand('echo ' + pw + ' | sudo -S wg-quick down ' + interfaceValue,
                    function(data) {
                        console.log("Taking down Wireguard Interface: ");
                        // console.dir(data);
                        
                        try {
                            console.log("Trying to Clear Interval");
                            window.clearInterval(checkSpeed);
                        } catch (err) {
                            console.log("Error clearing interval: " + err);
                        }
                        checkConnection("toggle");
                    },
                    function() {
                        console.error('error');
                    }
                );
            }
        },
        function() {
            console.log("Error in readfile for pw: " + error);
        }
    )

    
}