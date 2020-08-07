// ****    check connectivity
var checkConnection = function(reason) {
    console.log("");
    console.log("    ----    Inside Check Connection function");
    buildIfaceList();
    let selIndex = $("#chooseIface").val();
    if (typeof selIndex == 'undefined' || selIndex == null || selIndex == "") {
        selIndex = 0;
    }
    console.log("");
    console.log("ip addr show " + selIndex);
    console.log("");
    localStorage.setItem("selIndex", selIndex);

    Neutralino.os.runCommand('ip addr show ' + selIndex,
        function(data) {
            let info = data.stdout;
            // console.log("-- ####  --  #### --");
            // console.log("");
            // console.log("show ip addr command output: ");
            // console.log(data);
            // console.log("");
            // console.log("-- ####  --  #### --");

            let inetStart = info.search('inet');

            if (inetStart >= 0) {
                getIpAddress();
            } else {
                getIpAddress(reason);
            }
        },
        function() {
            console.error('error');
        }
    )
}