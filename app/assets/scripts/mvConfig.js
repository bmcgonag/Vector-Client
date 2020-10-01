// ****    read the file
var mvConfig = function(filename_in) {
    // console.log("");
    // console.log("    ----    Inside Move file function");
    // ****    move this to the calling function and set it as a session variable
    let filename = filename_in.replace(/\r?\n|\r/, "");

    let didNameChange = localStorage.getItem("changedInterface");
    let newName = localStorage.getItem("newFileName");

    if (didNameChange == "yes") {
        // console.log("Changing the interface name on copy:");
        // console.log('echo ' + configs.sudo_user_pass + ' | sudo -S cp ' + filename + ' /etc/wireguard/' + newName + '.conf');

        Neutralino.os.runCommand('echo ' + configs.sudo_user_pass + ' | sudo -S cp ' + filename + ' /etc/wireguard/' + newName + '.conf', 
            function(data) {
                // console.log(data.stdout);
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