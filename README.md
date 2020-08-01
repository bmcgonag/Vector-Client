# Wireguard UI Client
A client UI for Wireguard on Linux (may work on Mac and Windows as well)

I made this because, while it's great to be proficient on the shell terminal, it's just nice to have a GUI app sometimes. Something that simply grabs your attention and says, "Hey, I'm here, and connected!."  Sometimes, maybe it says, "Hey, ummmm, I'm not connected...but it's easy to connect me if you want."

Anyway, I just want linux to be a first class citizen along with the rest of the Operating Systems in the world.  

I 100% appreciate what Wireguard is doing for VPNs and encryption, so please don't misunderstand.  I just wanted to do something to help out. 

## Help Wanted

I have the code for the application itself under contruction for my new version, and things are going well.  Where I would really like some help is on a better installer script that will help users with any distro install the software and use it without any snags.  

So, if anyone is a bash scripting guru, and would like to help out, it would be much appreciated.

## Changes under way
Currently I'm updating the UI and User Experience a bit with the app.  I liked my first run, but it wasn't exactly simple to import an interface, and I really didn't have any good way to add an existing interface to the app.

- Improving the Connection / Disconnect UX / UI
- Adding the abilityt o add existing interfaces for use with the app by interface name.
- Adding bandwidth usage readouts for download and upload speeds on the connected interface.
- Separating the UI into navigable sections.

## Installation

Use this command 

`curl https://github.com/bmcgonag/WireguardUIClient/releases/download/0.6.0/install_wireguard_gui_client.sh | sh`

Or, 

Download the script from 

https://github.com/bmcgonag/WireguardUIClient/releases/download/0.6.0/install_wireguard_gui_client.sh

and use the command

`. ./install_wireguard_gui_clidnt.sh`

or 

`sh ./install_wireguard_gui_client.sh`

## Me
I'm not a programmer by trade.  I'm a hobbyist (on my best day), so take this for what it is.  If you have issues, please let me know, and I'll see what I can do to fix it. 

I'm always happy to have help, and pull requests are more than encouraged. 

## The Project
I hope this will make it easy for you to use Wireguard from the client perspective. 

NeutralinoJS is a nice little project, and they are working on it, so hopefully running this from the desktop won't be such a pain in the future.

I'm making a script that will help pull the zipped up version of this repo, and get the files where they need to be.  Additionally, I will try to add something that creates a launcher for you. 

## What's in this repo?
- 2 Binaries
-- Windows (not something I've tested or messed with)
-- Linux
- Files to create the UI and give it functionality.
-- inside the app/assets folder is a config.js that you need to modify.
- wgvpn.sh
-- a shell script that can be used in a launcher to create a desktop icon to launch the app.

## Credits
### NeutralinoJS Prjoect
https://neutralino.js.org/

## Contribute
I am always happy for anyone to jump in and start helping me with any project.  