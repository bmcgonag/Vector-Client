// ****    Import a Wireguard Configuration file.
var importConfig = function() {
    // console.log("");
    // console.log("    ----    Inside Import Configuration function");
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
            let iFacesStore = localStorage.getItem("interfaceArray");
            let iFaces = iFacesStore.trim().split(',');
            let ifaceCount = iFaces.length;
            console.log("iFaces are: " + iFaces + " | with length: " + ifaceCount);

            // if (if)
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