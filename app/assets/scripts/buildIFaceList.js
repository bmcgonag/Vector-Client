// ****    build select list for interfaces
var buildIfaceList = function () {
    let intArray = [];
    // console.log("");
    // console.log("    ----    Inside Build Interface List function");

    // first we'll remove the options from the drop-down then rebuild it
    let iFaceList = document.getElementById("chooseIface");

    while (iFaceList.options.length != 0) {
        iFaceList.options.remove(iFaceList.options.length - 1);
    }

    Neutralino.filesystem.readFile("interfaceInfo.conf",
        function(data) {
            intArray = data.content.trim().split(',');
            // console.log("--- line 172 --- Int Array: " + intArray);
            localStorage.setItem("interfaceArray", intArray);

            // console.log(" - Interfaces are:");
            // console.log(intArray);
            let iFaces = intArray;

            // ****    find how many elements in the array
            let iFaces_count = iFaces.length;
            // console.log("Interface Count = " + iFaces_count);

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