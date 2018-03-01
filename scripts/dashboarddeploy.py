#!/usr/bin/python
# for the top-5-bitrate:
# copy from api/sflow-rt/mininet-dashboard to api/sflow-rt/app/mininet-dashboard
# for each dpid:
# copy from api/sflow-rt/mininet-dashboardx to api/sflow-rt/app/mininet-dashboard(+dpid)

import os
import shutil
class dashboarddeploy:
    def deploy(self):
        path = os.getcwd()
        filename_topo=path+"/temp/outtopo.py"
        topo_file = open(filename_topo, "r")
        nb_switch=0
        tab_dpid=[]
        for ligne in topo_file:
            if "addSwitch('s" in ligne:
                nb_switch=nb_switch+1
                pos1 = ligne.find("'s")
                pos2 = ligne.find("',")
                dpid = ligne[pos1 + 2:pos2]
                dpid=int(dpid)
                tab_dpid.append(dpid)

        topo_file.close()
        shutil.copytree(path + "/api/sflow-rt/mininet-dashboard", path + "/api/sflow-rt/app/mininet-dashboard")
        shutil.copytree(path + "/api/sflow-rt/dashboard-example", path + "/api/sflow-rt/app/dashboard-example")

        for i in range(0,nb_switch):
            shutil.copytree(path+"/api/sflow-rt/mininet-dashboardx",path+"/api/sflow-rt/app/mininet-dashboard"+str(tab_dpid[i]))

        return tab_dpid


