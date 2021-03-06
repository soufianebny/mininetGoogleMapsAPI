Version: 4.16

IMPORTANT
======
The software you are going to play with, use several other programs.
You must check or apply the following Prerequisites.

Prerequisites
======

OS:
------
The software has been tested on Ubuntu 16.04.
From now, it doesn't work on Ubuntu 17 because of an OVSwitch problem compatibility.
So, use Ubuntu 16.04 in a VM with NAT access for example. Internet must be available for reaching google maps servers.


MININET:
------
Mininet is the network emulator
This software has been tested with Mininet version 2.2.2

A good way to install Mininet:
In a home directory (within sudo privilege $):
~~~~
$ git clone git://github.com/mininet/mininet
$ cd mininet
$ git tag  # list available versions
$ git checkout -b 2.2.2 2.2.2  # or whatever version you wish to install
$ cd ..
$ mininet/util/install.sh -a
~~~~


RYU:
------
RYU is the SDN controller
~~~~
git clone git://github.com/osrg/ryu.git
cd ryu
python ./setup.py install
~~~~

Bottle server
------
Bottle is used by Mininet REST API.
~~~~
$ pip install bottle
~~~~

Upgrade Requests python module
------
~~~~
pip install --upgrade requests
~~~~

Java
------
Java is used by sFlow
~~~~
sudo apt-get install openjdk-8-jdk openjdk-8-doc 
~~~~

Firefox Addon
------
This addon activate CORS in the browser.
Install it from here : https://addons.mozilla.org/fr/firefox/addon/cors-everywhere/
->Turn it to green



RUN IT
======
In the software directory (important!!), within sudo privilege:
~~~~
$ python run.py BTEurope.graphml
~~~~
in another terminal:
~~~~
$ firefox index.html
~~~~

CLOSE IT 
======
Traditional ctrl+c kill the software.
To make sure that everything is closed, in the software directory (important!!):
~~~~
$ python scripts/close.py
~~~~