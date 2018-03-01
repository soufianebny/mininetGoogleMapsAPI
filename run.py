#!/usr/bin/python
import sys

sys.path.append("scripts")
sys.path.append("temp")
sys.path.append("api")

from graphml2json import *
from graphml2topo import *
from dashboarddeploy import *
from init import *
from close import *
import os
import shutil


if __name__ == "__main__":

    if len(sys.argv)==1:
        print("No argument. Expect one argument: graphmlfile")
    elif len(sys.argv)==2:
        graphmlfile=sys.argv[1]

        obj0=close()
        obj0.clean()
        print("Starting..........")
        path = os.getcwd()
        shutil.copyfile(path+"/"+graphmlfile,path+"/temp/"+graphmlfile)

        obj1=graphml2json()
        obj1.convertgraphml2json(graphmlfile)
        print("GeoJSON generated")
        obj2=graphml2topo()
        obj2.convertgraphml2topo(graphmlfile)
        obj3=dashboarddeploy()
        tabdpid=obj3.deploy()

        print("Mininet topology generated")
        obj4=init()

        obj4.initryumininetapi(tabdpid)
