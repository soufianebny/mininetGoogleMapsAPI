#!/usr/bin/python
import re
class graphml2topo:
    def convertgraphml2topo(self,graphmlname):
        filename_graphml="temp/"+graphmlname
        graphmlfile = open(filename_graphml, "r")
        topofile = open("temp/outtopo.py", "w")
        tabulation="\t"
        record_txt="#!/usr/bin/python\n"
        record_txt=record_txt+"from mininet.topo import Topo\n"
        #record_txt=record_txt+"from mininet.net import Mininet\n"
        #record_txt=record_txt+"from mininet.node import Node\n"
        #record_txt=record_txt+"from mininet.node import RemoteController\n"
        #record_txt=record_txt+"from mininet.link import TCLink, Link\n"
        #record_txt=record_txt+"from mininet.util import waitListening\n"
        #record_txt=record_txt+"from mininet.cli import CLI\n"
        #record_txt=record_txt+"from mininet_rest import MininetRest\n"
        record_txt=record_txt+"class MyTopo(Topo):\n"
        record_txt=record_txt+tabulation+"def __init__(self):\n"
        record_txt=record_txt+tabulation+tabulation+"Topo.__init__(self)\n"

        ville_exist=0
        tab_ville=[]
        dpid=[]
        keylabel = ""
        keyid = ""
        keylatitude = ""
        keylongitude = ""

        for ligne in graphmlfile:
            chaine = ligne.strip()

            # getting key label for name of town
            if "<key attr.name=\"label\" attr.type=\"string\" for=\"node\"" == chaine[:52]:
                pos1 = chaine.find("id=\"")
                pos2 = chaine.find("\" />")
                keylabel = chaine[pos1 + 4:pos2]

            # getting key id
            if "<key attr.name=\"id\" attr.type=\"int\" for=\"node\"" == chaine[:46]:
                pos1 = chaine.find("id=\"")
                pos2 = chaine.find("\" />")
                keyid = chaine[pos1 + 4:pos2]

            # getting key latitude
            if "<key attr.name=\"Latitude\" attr.type=\"double\" for=\"node\"" == chaine[:55]:
                pos1 = chaine.find("id=\"")
                pos2 = chaine.find("\" />")
                keylatitude = chaine[pos1 + 4:pos2]
            # getting key longitude
            if "<key attr.name=\"Longitude\" attr.type=\"double\" for=\"node\"" == chaine[:56]:
                pos1 = chaine.find("id=\"")
                pos2 = chaine.find("\" />")
                keylongitude = chaine[pos1 + 4:pos2]


            # detect latitude
            if "<data key=\"" + keylatitude + "\">" == chaine[:16]:
                ville_exist=1

            # detecte une ligne id
            if "<data key=\"" + keyid + "\">" == chaine[:16] and ville_exist == 1:
                pos1 = chaine.find(">")
                pos2 = chaine.find("</")
                id = chaine[pos1 + 1:pos2]

            # detect a town without longitude and latitude ==> do not take into account
            if "<data key=\"" + keylabel + "\">" == chaine[:16] and ville_exist == 0:
                tab_ville.append("null")
                dpid.append("null")

            # detect town
            if "<data key=\"" + keylabel + "\">" == chaine[:16] and ville_exist == 1:
                pos1 = chaine.find(">")
                pos2 = chaine.find("</")
                nom_ville = chaine[pos1+1:pos2]
                nom_ville=nom_ville+"_"+str(int(id)+1)
                nom_ville=nom_ville.replace(" ","_")
                nom_ville = nom_ville.replace("'", "_")
                tab_ville.append(nom_ville)
                dpid.append(int(id) + 1)
                ville_exist = 0

        nb_ville=len(tab_ville)
        reseau="10.1.1"
        mask=24

        #add hosts
        for i in range(0,len(tab_ville)):
            if tab_ville[i]!="null":
                record_txt = record_txt+tabulation+tabulation+"h_"+tab_ville[i]+" = self.addHost('h_"+str(i+1)+"', ip='10.1.1."+str(i+1)+"')\n"

        #add switchs
        for i in range(0,len(tab_ville)):
            if tab_ville[i] != "null":
                dpidvalue = hex(dpid[i])[2:]
                dpidvalue = '0' * (16 - len(dpidvalue)) + dpidvalue
                record_txt = record_txt + tabulation + tabulation + "sw_" + tab_ville[i] + " = self.addSwitch('s" + str(dpid[i]) + "',dpid='" + dpidvalue + "')\n"
        #add links
        for i in range(0,len(tab_ville)):
            if tab_ville[i]!="null":
                record_txt = record_txt + tabulation + tabulation + "self.addLink(h_" + tab_ville[i] + ", sw_" + \
                             tab_ville[i] + ", bw=100, delay='1ms', loss=0)\n"

        graphmlfile.close()
        graphmlfile = open(filename_graphml, "r")

        for ligne in graphmlfile:
            chaine = ligne.strip()

            if "<edge source=" == chaine[:13]:

                pos1 = chaine.find("ce=\"")
                pos2 = chaine.find("\" ta")
                source = chaine[pos1+4:pos2]

                pos1 = chaine.find("et=\"")
                pos2 = chaine.find("\">")
                destination = chaine[pos1 + 4:pos2]
                if tab_ville[int(source)]!="null" and tab_ville[int(destination)]!="null":
                    record_txt = record_txt + tabulation + tabulation + "self.addLink(sw_"+tab_ville[int(source)]+", sw_"+tab_ville[int(destination)]+", bw=100, delay='1ms', loss=0)\n"



        #record_txt=record_txt+"topos = {'mytopo': (lambda: MyTopo())}\n"
        topofile.write(record_txt)

        topofile.close()
        graphmlfile.close()
