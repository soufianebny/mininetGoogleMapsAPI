#!/usr/bin/python
class graphml2json:
    def convertgraphml2json(self,graphmlname):
        filename_graphml = "temp/" + graphmlname

        graphmlfile = open(filename_graphml, "r")
        jsonfile = open("temp/out.json", "w")
        datafile= open("temp/data.json", "w")
        record_txt="{ \"type\": \"FeatureCollection\",\"features\": ["

        longitude_list=[]
        latitude_list=[]
        ville_exist=0
        dpid=[]
        tab_ville=[]
        keylabel=""
        keyid=""
        keylatitude=""
        keylongitude=""

        for ligne in graphmlfile:
            chaine = ligne.strip()

            #getting key label for name of town
            if "<key attr.name=\"label\" attr.type=\"string\" for=\"node\"" == chaine[:52]:
                pos1 = chaine.find("id=\"")
                pos2 = chaine.find("\" />")
                keylabel = chaine[pos1+4:pos2]

            # getting key id
            if "<key attr.name=\"id\" attr.type=\"int\" for=\"node\"" == chaine[:46]:
                pos1 = chaine.find("id=\"")
                pos2 = chaine.find("\" />")
                keyid = chaine[pos1+4:pos2]

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
            if "<data key=\""+keylatitude+"\">" == chaine[:16]:
                ville_exist=1
                pos1 = chaine.find(">")
                pos2 = chaine.find("</")
                latitude = chaine[pos1+1:pos2]
                latitude_list.append(latitude)
            # detect id
            if "<data key=\""+keyid+"\">" == chaine[:16] and ville_exist==1:
                pos1 = chaine.find(">")
                pos2 = chaine.find("</")
                id = chaine[pos1 + 1:pos2]
            # detect longitude
            if "<data key=\""+keylongitude+"\">" == chaine[:16] and ville_exist==1:
                pos1 = chaine.find(">")
                pos2 = chaine.find("</")
                longitude = chaine[pos1 + 1:pos2]
                longitude_list.append(longitude)
            # detect a town without longitude and latitude ==> do not take into account
            if "<data key=\""+keylabel+"\">" == chaine[:16] and ville_exist == 0:
                latitude_list.append("null")
                longitude_list.append("null")
                dpid.append("null")
            # detect town
            if "<data key=\""+keylabel+"\">" == chaine[:16] and ville_exist==1:
                pos1 = chaine.find(">")
                pos2 = chaine.find("</")
                nom_ville = chaine[pos1+1:pos2]
                nom_ville = nom_ville + "_" + str(int(id) + 1)
                nom_ville=nom_ville.replace("'"," ")
                tab_ville.append(nom_ville)
                dpid.append(int(id) + 1)
                record_txt=record_txt+"{ \"type\": \"Feature\",\"geometry\": {\"type\": \"Point\", \"coordinates\": ["+longitude+","+latitude+"]},\"properties\": {\"name\": \""+nom_ville+"\"}},"
                ville_exist = 0

        graphmlfile.close()
        graphmlfile = open(filename_graphml, "r")
        # detect links between town
        for ligne in graphmlfile:
            chaine = ligne.strip()

            if "<edge source=" == chaine[:13]:
                pos1 = chaine.find("ce=\"")
                pos2 = chaine.find("\" ta")
                source = chaine[pos1+4:pos2]

                pos1 = chaine.find("et=\"")
                pos2 = chaine.find("\">")
                destination = chaine[pos1 + 4:pos2]
                longitude_source = longitude_list[int(source)]
                longitude_destination = longitude_list[int(destination)]
                latitude_source = latitude_list[int(source)]
                latitude_destination = latitude_list[int(destination)]
                dpid1=str(dpid[int(source)])
                dpid2 = str(dpid[int(destination)])
                if (longitude_source !="null") and (longitude_destination !="null") and (latitude_source !="null") and (latitude_destination!="null"):
                    #record_txt=record_txt+"{ \"type\": \"Feature\",\"geometry\": {\"type\": \"LineString\", \"coordinates\": [["+longitude_source+","+latitude_source+"],["+longitude_destination+","+latitude_destination+"]]}},"
                    record_txt = record_txt + "{ \"type\": \"Feature\",\"geometry\": {\"type\": \"LineString\", \"coordinates\": [[" + longitude_source + "," + latitude_source + "],[" + longitude_destination + "," + latitude_destination + "]]},\"properties\": {\"name\": \""+dpid1+"-"+dpid2+"\"}},"

        record_txt=record_txt[:-1]
        record_txt=record_txt+"]}"
        jsonfile.write(record_txt)
        jsonfile.close()
        datafile.write(("data='"+record_txt+"'"))
        datafile.close()
        graphmlfile.close()
