
var getIpAddress = function(reason) {
    console.log("");
    console.log("    ----    Inside Check IP Address function");
    let selIndex = localStorage.getItem("selIndex");
    if (typeof selIndex == 'undefined' || selIndex == null || selIndex == "") {
        selIndex = 0;
    }

    Neutralino.os.runCommand('dig +short myip.opendns.com @resolver1.opendns.com',
        function(data) {
            // console.log("Got data back: " + data.stdout);
            let ipAddress = data.stdout;
            document.getElementById('output').innerText = ipAddress;

            if (reason == "start") {
                buildIfaceList();
            }
        },
        function() {
            console.error("Error");
        }
    )
}