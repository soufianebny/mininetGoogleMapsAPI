#generate metrics files for each dpid

class metricsfiles:
  def generate_metrics_files(self,tab_dpid):

    filename_switches = "temp/switchportlist"

    for dpid in tab_dpid:
      switcheslist_file = open(filename_switches, "r")
      lines=switcheslist_file.readlines()
      tabifindex=[]
      for line in lines:
        if line.startswith("s"+str(dpid)+"-"):
          tabifindex.append(line.split(" ")[0])

      filename_metrics_new="api/sflow-rt/app/mininet-dashboard"+str(dpid)+"/scripts/metrics.js"
      filename_metrics="api/sflow-rt/mininet-dashboardx/scripts/metrics.js"
      metrics_new_file = open(filename_metrics_new, "w")
      metrics_file = open(filename_metrics, "r")

      lines=metrics_file.readlines()
      line_number=1
      for line in lines:
        if line_number<37:
          metrics_new_file.write(line)
        if line_number==38:
          metrics_new_file.write("var port = topologyInterfaceToPort(val.agent,val.dataSource);" + "\n")
          txt="if ("
          ou=""

          for ifindex in tabifindex:
            txt=txt+ou + " port.port == "+ "'" + str(ifindex) + "'"
            ou=" || "
          txt=txt+"){"+"\n"
          metrics_new_file.write(txt)

        if line_number>38 and line_number != 43:
          metrics_new_file.write(line)
        if line_number ==43:
          metrics_new_file.write("}}")
        line_number=line_number+1
      metrics_new_file.close()
      switcheslist_file.close()