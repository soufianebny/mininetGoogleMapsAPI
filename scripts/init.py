#!/usr/bin/python
from subprocess import call,Popen, PIPE, STDOUT, check_output
from mininet.util import quietRun
from os import listdir
import os
from json import dumps
import socket
import re
from requests import put
from mininet.net import *
from mininet.node import Node
from mininet.node import RemoteController
from mininet.link import TCLink, Link
from mininet.cli import CLI
from mininet_rest import MininetRest
from metricsfiles import *
import sys
import thread

class init():

    def __init__(self):
        self.collector = "127.0.0.1"
        self.sampling = 10
        self.polling = 10
        self.ifname = ""
        self.agent = ""


    #start Ryu and wait for a stdout specific line before starting mininet thread
    def initryumininetapi(self,tabdpid):

        print("starting Ryu...")
        myPopenryu = Popen(["ryu-manager", "api/simple_switch_stp_13.py", "api/ofctl_rest.py", "--wsapi-port", "9090"], stdin = PIPE, stdout = PIPE, stderr = STDOUT)

        (self.ifname, self.agent) = self.getIfInfo(self.collector)

        while True:

            line = myPopenryu.stdout.readline()

            if line.startswith("instantiating app ryu.controller.ofp_handler of OFPHandler"):
                thread.start_new_thread(self.startmininet, (tabdpid,))

            status = myPopenryu.poll()

            if status is not None:
                break
        myPopenryu.kill()

    #start sflow
    def sflow(self):
        myPopensflow = Popen(["sh","api/sflow-rt/start.sh"], stdin = PIPE, stdout = PIPE, stderr = STDOUT)

    #get interface name from ip
    def getIfInfo(self,ip):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect((ip, 0))
        ip = s.getsockname()[0]
        ifconfig = check_output(['ifconfig'])
        ifs = re.findall(r'^(\S+).*?inet addr:(\S+).*?', ifconfig, re.S | re.M)

        if ifs!=[]:
            for entry in ifs:
                if entry[1] == ip:
                    return entry
        else:
            ifs = re.findall(r'^(\S+).*?inet adr:(\S+).*?', ifconfig, re.S | re.M)
            for entry in ifs:
                if entry[1] == ip:
                    return entry

    #importing topo and start mininet with it
    #generate switchesportlist file
    #generate metrics files for before starting sflow
    #starting Mininet REST



    def startmininet(self,tabdpid):
        print("starting Mininet...")
        ostopo = __import__('outtopo')

        topo = ostopo.MyTopo()
        net = Mininet(topo=topo, link=TCLink, controller=RemoteController)
        net.start()



        path = '/sys/devices/virtual/net/'
        rep = os.getcwd()
        file_switches = open(rep + "/temp/switchportlist", "w")
        for child in listdir(path):
            parts = re.match('(^s[0-9]+)-(.*)', child)
            if parts == None: continue
            ifindex = open(path + child + '/ifindex').read().split('\n', 1)[0]
            file_switches.write(child + " " + ifindex + "\n")
        file_switches.close()

        obj = metricsfiles()
        obj.generate_metrics_files(tabdpid)

        print("starting sflow...")
        thread.start_new_thread(self.sflow, ())

        while True:
            proc1 = Popen(["netstat", "-laputen"], stdout=PIPE, stderr=STDOUT)
            proc2 = Popen(['grep', '8008.*LISTEN'], stdin=proc1.stdout,
                          stdout=PIPE, stderr=PIPE)
            line = proc2.stdout.readline()
            proc1.kill()
            proc2.kill()
            if len(line) > 0:
                break


        mininet_rest = MininetRest(net)
        print("starting Mininet API...")
        thread.start_new_thread(self.runmininet, (mininet_rest,))

        print("adding sflow agents on each switches...")
        sflow = 'ovs-vsctl -- --id=@sflow create sflow agent=%s target=%s sampling=%s polling=%s --' % (
        self.ifname, self.collector, self.sampling, self.polling)
        for s in net.switches:

            sflow += ' -- set bridge %s sflow=@sflow' % s

        quietRun(sflow)


        topo = {'nodes': {}, 'links': {}}
        for s in net.switches:
            topo['nodes'][s.name] = {'agent': self.agent, 'ports': {}}
        path = '/sys/devices/virtual/net/'

        for child in listdir(path):
            parts = re.match('(^s[0-9]+)-(.*)', child)
            if parts == None: continue
            ifindex = open(path + child + '/ifindex').read().split('\n', 1)[0]
            topo['nodes'][parts.group(1)]['ports'][child] = {'ifindex': ifindex}

        i = 0
        file_switches = open(rep + "/temp/linkslist", "w")
        for s1 in net.switches:
            j = 0
            for s2 in net.switches:
                if j > i:
                    intfs = s1.connectionsTo(s2)
                    for intf in intfs:

                        s1ifIdx = topo['nodes'][s1.name]['ports'][intf[0].name]['ifindex']
                        s2ifIdx = topo['nodes'][s2.name]['ports'][intf[1].name]['ifindex']

                        linkName = '%s-%s' % (s1.name, s2.name)
                        topo['links'][linkName] = {'node1': s1.name, 'port1': intf[0].name, 'node2': s2.name,
                                                   'port2': intf[1].name}
                        file_switches.write(s1.name+"-"+s2.name+":"+intf[0].name+"_"+intf[1].name+"\n")
                j += 1
            i += 1
        file_switches.close()
        put('http://' + self.collector + ':8008/topology/json', data=dumps(topo))



        print("--------------------------")
        print("Application loaded. Enjoy!")
        print("--------------------------")


        #CLI(net)

    def runmininet(self,mininet_rest):
        mininet_rest.run()



