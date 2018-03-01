#!/usr/bin/python
from subprocess import call, Popen, PIPE, STDOUT
import os
import shutil

class close:

    def __init__(self):
        self.clean()

    def clean(self):
        print("Wait for cleaning...")

        proc10 = call(["mn", "-c"])
        proc1 = Popen(["ps", "-e"], stdout = PIPE, stderr = STDOUT)
        proc2 = Popen(['grep', 'ryu-manager'], stdin=proc1.stdout,
                                 stdout=PIPE, stderr=PIPE)
        line = proc2.stdout.readline()

        if len(line)>0:
            pid=line.split()[0]
            proc3=Popen(["kill", "-9", pid], stdout=PIPE, stderr=STDOUT)

            while True:
                status=proc3.poll()
                if status is not None:
                    break


        proc4 = Popen(["netstat", "-laputen"], stdout=PIPE, stderr=STDOUT)
        proc5 = Popen(['grep', '6343'], stdin=proc4.stdout,
                      stdout=PIPE, stderr=PIPE)
        lines = proc5.stdout.readlines()

        for line in lines:
            l = line.split()
            if l[5] == "LISTEN" or l[5] == "ESTABLISHED" or l[5] == "TIME_WAIT":
                pid = line.split()[8].split('/')[0]
            else:
                pid = line.split()[7].split('/')[0]

            proc6 = Popen(["kill", "-9", pid], stdout=PIPE, stderr=STDOUT)
            while True:
                status=proc6.poll()
                if status is not None:
                    break




        proc7 = Popen(["netstat", "-laputen"], stdout=PIPE, stderr=STDOUT)
        proc8 = Popen(['grep', '6653'], stdin=proc7.stdout,
                      stdout=PIPE, stderr=PIPE)

        lines = proc8.stdout.readlines()

        for line in lines:
            l=line.split()
            if l[5]=="LISTEN" or l[5]=="ESTABLISHED" or l[5]=="TIME_WAIT":
                pid = line.split()[8].split('/')[0]
            else:
                pid = line.split()[7].split('/')[0]

            proc9 = Popen(["kill", "-9", pid], stdout=PIPE, stderr=STDOUT)
            while True:
                status=proc9.poll()
                if status is not None:
                    break

        path=os.getcwd()
        shutil.rmtree(path+"/api/sflow-rt/app/")
        os.makedirs(path+"/api/sflow-rt/app/")

        path = os.getcwd()
        shutil.rmtree(path + "/temp")
        os.makedirs(path + "/temp")


        print("Cleaning done")




if __name__ == '__main__':
    b=close()
    b.clean()