//////////////////////////////////////////API Calls////////////////////////////////////////////////////////
// ryu api rest: port=9090									         //
// mininet api rest: port=8080										 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 *Get file
 */
function apiGetFile(){
	var methode = "GET"
	var url = "http://0.0.0.0:8080/linksfile"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			data = xhr.responseText;  //xhr.responseText contains the response of http 
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send(); 
	return data;	
}


/*
 *Switch statistics
 */
function apiStats(dpid,city){
	var methode = "GET"
	var url = "http://0.0.0.0:9090/stats/aggregateflow/"+dpid
	var xhr = new XMLHttpRequest();	//xhr is an http object
	//xhr.withCredentials = true;
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiStatsParsing(xhr.responseText,dpid,city)  //xhr.responseText contains the response of http 
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send();
}


/*
 *Get all interfaces of the switch
 */
function apiInterfacesSwitch(dpid,city){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/s"+dpid+"/cmd"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiInterfacesSwitchParsing(xhr.responseText,dpid,city)  //xhr.responseText contains the response of http 
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send('ifconfig | grep -A7 --no-group-separator \'^s'+dpid+'-eth\'');
}



/*
 *Get all interfaces of the host
 */
function apiInterfacesHost(dpid,city){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/h_"+dpid+"/cmd"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiInterfacesHostParsing(xhr.responseText,dpid,city)  //xhr.responseText contains the response of http 
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send('ifconfig');
}


/*
 *Get host mac table
 */
function apiMacHost(dpid,city){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/h_"+dpid+"/cmd"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiMacHostParsing(xhr.responseText,dpid,city)  //xhr.responseText contains the response of http 
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send('arp');
}


/*
 *Switch flow table
 */
function apiFlowMininet(dpid,city){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/s"+dpid+"/cmd"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiFlowMininetParsing(xhr.responseText,dpid,city)  //xhr.responseText contains the response of http 
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send('ovs-ofctl dump-flows "s'+dpid+'"');
}


/*
 *Get sFlow graphs for each switch
 */
function apiSflowSolo(dpid,city){
	var methode = "GET"
	var url = "http://0.0.0.0:8008/app/mininet-dashboard"+dpid+"/html/"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiSflowSoloParsing(xhr.responseText,dpid,city)  //xhr.responseText contains the response of http
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send();
}


/*
 *Delete switch flow table
 */
function apiSupFlows(dpid,city){
	var methode = "GET"
	var url = "http://0.0.0.0:9090/stats/flowentry/clear/"+dpid
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiDeleteFlowParsing(xhr.responseText,dpid,city)  //xhr.responseText contains the response of http 
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send();
}



/*
 *Ping between 2 hosts
 */
function apiPing(host1,host2,number){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/h_"+host1+"/cmd"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiPingParsing(xhr.responseText,host1,host2)  //xhr.responseText contains the response of http 
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send('ping -c '+number+' h_'+host2);
}


/*
 *Ping all
 */
function apiPingAll(){
	var methode = "GET"
	var url = "http://0.0.0.0:8080/pingall"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiPingAllParsing(xhr.responseText)  //xhr.responseText contains the response of http 
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send();
}


/* 
 *Iperf  
 */
function apiIperf(host1,host2,prot){
	var methode = "GET"
	var url = "http://0.0.0.0:8080/iperf/h_"+host1+"/h_"+host2+"/"+prot
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiIperfParsing(xhr.responseText,host1,host2)  //xhr.responseText contains the response of http 
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send();
}


/*
 *Get OpenVswitch version (on Welcome)
 */
function apiWelcome1(){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/s1/cmd"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiWelcomeParsing1(xhr.responseText)  //xhr.responseText contains the response of http 
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send('ovs-vswitchd -V');
}


/*
 *Get Mininet version (on Welcome)
 */
function apiWelcome3(){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/s1/cmd"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiWelcomeParsing3(xhr.responseText)  //xhr.responseText contains the response of http 
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send('mn --version');
}


/*
 *Get all switches and hosts (on Welcome)
 */
function apiWelcome2(){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/s1/cmd"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiWelcomeParsing2(xhr.responseText)  //xhr.responseText contains the response of http 
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send('ovs-vsctl list-br');
}


/*
 *Get the general sFlow graph 1 (on Welcome)
 */
function apiSflowTopologie(){
	var methode = "GET"
	var url = "http://0.0.0.0:8008/app/mininet-dashboard/html/"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiSflowTopologieParsing(xhr.responseText)  //xhr.responseText contains the response of http
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send();
}


/*
 *Get general sFlow graphs 2 (on Welcome)
 */
function apiSflowTraffic(){
	var methode = "GET"
	var url = "http://0.0.0.0:8008/app/dashboard-example/html/"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			apiSflowTrafficParsing(xhr.responseText)  //xhr.responseText contains the response of http
	    	}
	};
	xhr.open(methode, url, true);
	xhr.send();
}


/*
 *Up a switch 
 */
function apiUpSwitch(dpid,city){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/s"+dpid+"/cmd"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.open(methode, url, true);
	xhr.setRequestHeader('Content-type','Text');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("printSpace").innerHTML = "Switch s"+dpid+" is up";
	    	}
	};
	var command = "ifconfig -a | grep -o '^s"+dpid+"-eth[[:digit:]]\\\{0,2\\\}' | xargs -I{} ifconfig {} up"
	xhr.send(command);		
}

/*
 *Down a switch 
 */
function apiDownSwitch(dpid,city){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/s"+dpid+"/cmd"
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.open(methode, url, true);
	xhr.setRequestHeader('Content-type','Text');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("printSpace").innerHTML = "Switch s"+dpid+" is down";
	    	}
	};
	var command = "ifconfig -a | grep -o '^s"+dpid+"-eth[[:digit:]]\\\{0,2\\\}' | xargs -I{} ifconfig {} down"
	xhr.send(command);	
}


/*****************Links**********************/
/*
 *UP first link    
 */
function apiUPlinks1(link,dpid){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/s"+dpid+"/"+link 
	console.log(url)
	var xhr = new XMLHttpRequest();	//xhr is an http object	
	xhr.open(methode, url, true);
	xhr.setRequestHeader('Content-type','application/json');	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("printSpace").innerHTML = "Le lien est UP";
	    	}
	};	
	xhr.send('{"status": "up"}');	
}

/*
 *UP second link 
 */
function apiUPlinks2(link,dpid){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/s"+dpid+"/"+link
	console.log(url)
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.open(methode, url, true);
	xhr.setRequestHeader('Content-type','application/json');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("printSpace").innerHTML = "Le lien est UP";
	    	}
	};
	xhr.send('{"status": "up"}');
}


/*
 *DOWN first link   
 */
function apiDOWNlinks1(link,dpid){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/s"+dpid+"/"+link
	console.log(url)
	var xhr = new XMLHttpRequest();	//xhr is an http object	
	xhr.open(methode, url, true);
	xhr.setRequestHeader('Content-Type','application/json');	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("printSpace").innerHTML = "Le lien est DOWN";
	    	}
	};
	xhr.send('{"status": "down"}');	
}

/*
 *DOWN second link 
 */
function apiDOWNlinks2(link,dpid){
	var methode = "POST"
	var url = "http://0.0.0.0:8080/nodes/s"+dpid+"/"+link
	console.log(url)
	var xhr = new XMLHttpRequest();	//xhr is an http object
	xhr.open(methode, url, true);
	xhr.setRequestHeader('Content-Type','application/json');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("printSpace").innerHTML = "Le lien est DOWN";
	    	}
	};
	xhr.send('{"status": "down"}');
}


/////////////////////////////////////Json+text Parsing + printing//////////////////////////////////////////
// ryu rest: port=9090										         //
// mininet rest: port=8080										 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *Find link interfaces between switches from the file
 */
function apiFindLinksBetweenParsing(file,link) {
	var objArray = file.trim().replace(/(\r?\n|\n|\r)/gm," ").split(' '); //from string to array
	//console.log(objArray)
	/*search for link & parse*/
	for (var i = 0; i < objArray.length; i++) {
		var string = objArray[i].toString();
		if (string.includes(link))		//ex: if "s1-s10" is in "s1-s6:s1-eth3_s6-eth2"
		{
		  res = objArray[i].split(':').pop()	//ex: s14-eth3_s18-eth8
		  console.log('links: '+res);
		  switch1 = res.split('_')[0];		//ex: s14-eth3
		  switch2 = res.split('_')[1];		//ex: s18-eth8
		}
    	} 
    	return [switch1,switch2];	//array 
}


/*
 *Switch statistics
 */
function apiStatsParsing(oData,dpid,city) {
	var obj = JSON.parse(oData); 
	document.getElementById("printSpace").innerHTML ="<b>Switch :</b> s"+dpid
							+ "<br>" +
							 "<b>Nombre de paquets total : </b>" + obj[dpid]["0"]["packet_count"] + " packets"
							 + "<br>" +
							 "<b>Nombre d'octets total : </b>" + obj[dpid]["0"]["byte_count"] + " bytes"
							 + "<br>" +
							 "<b>Nombre d'entrées dans la table de flux : </b>" + obj[dpid]["0"]["flow_count"];
}


/*
 *Get all interfaces of the switch
 */
function apiInterfacesSwitchParsing(oData,dpid,city) {
	document.getElementById("printSpace").innerHTML = "<pre>"+oData+"</pre>";
}


/*
 *Get all interfaces of the host
 */
function apiInterfacesHostParsing(oData,dpid,city) {
	var patternMac = /[a-fA-F0-9:]{17}|[a-fA-F0-9]{12}$/;
	var patternIpV4 = /(inet adr|addr):(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})(.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}/;
	var patternMasque = /(Masque|Mask):\S+/i;
	var patternPacketsRecus = /((Packets reçus)|(RX packets):\S+)/i;
	var patternErreurs = /((erreurs)|(errors):\S+)/;
	var patternMTU = /(MTU:\S+)/;
	var adresseMac = oData.match(patternMac);
	var adrIpV4 = oData.match(patternIpV4)[0].split(":")[1];
	var masque = oData.match(patternMasque)[0].split(":")[1];
	var packetsRecus = oData.match(patternPacketsRecus)[0].split(":")[1];
	var erreurs = oData.match(patternErreurs)[0].split(":")[1];
	var mtu = oData.match(patternMTU)[0].split(":")[1];
	document.getElementById("printSpace").innerHTML ="<b>Adresse Mac : </b>"+adresseMac+"<br/><b>Adresse IPv4 : </b>"
	+adrIpV4+"</br><b>Masque : </b>"+masque+"</br><b>Packets reçus :</b> "+packetsRecus+"<br/><b>Erreurs : </b>"+erreurs+"<br/><b>MTU : </b>"+mtu;
}



/*
 *Get host mac table
 */
function apiMacHostParsing(oData,dpid,city) {
	document.getElementById("printSpace").innerHTML = "<pre>"+oData+"</pre>";
}



/*
 *Switch flow table (Mininet api)
 */
function apiFlowMininetParsing(oData,dpid,city) {
	var patternFlowTable = /\w+=\w+([:|\.]\w+)*/g;
	var flowTable = oData.match(patternFlowTable);
	var mapFlowEntryValue = new Map();
	//On construit une map : clé -> flowEntry et valeur->la valeur associée au flowEntry
	for(i=0;i<flowTable.length;i++){
		var tmp = flowTable[i].split("=");
		if(mapFlowEntryValue.get(tmp[0])==null){
			mapFlowEntryValue.set(tmp[0],tmp[1]);
		}else{
			mapFlowEntryValue.set(tmp[0],tmp[1]+","+mapFlowEntryValue.get(tmp[0]));
		}

	}

       //On construit un tableau html dynamique
	var tableau ="<table>";
	
	for (var cle of mapFlowEntryValue.keys()) {
  		tableau=tableau+"<tr><td background-color='#000000'><b>"+cle+"</b></td>";
		var valeur = mapFlowEntryValue.get(cle).split(",");
		for(i=0;i<valeur.length;i++){
			tableau=tableau+"<td>"+valeur[i]+"</td>";
		}
		tableau=tableau+"</tr>";
	}
	
	tableau=tableau+"</table>";
	
	document.getElementById("printSpace").innerHTML = tableau;
}


/*
 *Get sFlow graphs for each switch 
 */
function apiSflowSoloParsing(oData,dpid,city) {
	document.getElementById("printSflow").innerHTML ="<iframe id='sFlowTopologie' src='http://0.0.0.0:8008/app/mininet-dashboard"
							+dpid+"/html/' style='border:none; height:100%; width:100%; position:absolute;''></iframe>";

}


/*
 *Delete switch flow table
 */
function apiDeleteFlowParsing(oData,dpid,city) { 
	document.getElementById("printSpace").innerHTML ="La table de flux de: "+city+" a été bien supprimé!";
}



/*
 *Ping between 2 hosts
 */
function apiPingParsing(oData,dpid,city) { 
	var patternPacketsTransmitted = /(\d+)(\spackets transmitted)/i;
	var nbPacketsTransmitted = oData.match(patternPacketsTransmitted)[0];
	var patternReceived = /(\d+)(\sreceived)/i;
	var nbPacketsReceived = oData.match(patternReceived)[0];
	var patternPacketLoss = /(\d+)%(\spacket loss)/i;
	var packetLoss = oData.match(patternPacketLoss)[0];
	//var patternTime = /time=\d+.\d ms/;
	//var time = oData.match(patternTime);
	document.getElementById("printSpace").innerHTML ="<b>Résultat du ping</b> : <br/>"+nbPacketsTransmitted+"<br/>"+nbPacketsReceived+"<br/>"+packetLoss+"<br/>";
}


/*
 *Ping all
 */
function apiPingAllParsing(oData) { 
	document.getElementById("printSpace").innerHTML ="PingAll terminé !" + oData;
}


/*
 *Iperf
 */
function apiIperfParsing(oData,host1,host2,prot) { 
	var jsonObject = JSON.parse(oData);
	console.log(jsonObject);
	var bandePassante;
	console.log(prot);
	if('UDP'== prot){
		bandePassante = jsonObject.results[2];
	}else{
		bandePassante = jsonObject.results[0];
	}
	document.getElementById("printSpace").innerHTML ="<b>La bande passante entre h_"+host2+" et h_"+host1+" est: </b><br>"+bandePassante;
}


/*
 *Get general sFlow graphs, type: topologie (on welcome)
 */
function apiSflowTopologieParsing(oData) {
	document.getElementById("printSflow").innerHTML ="<iframe id='sFlowTopologie' src='http://0.0.0.0:8008/app/mininet-dashboard/html/' style='border:none; height:100%; width:100%; position:absolute;''></iframe>";

}


/*
 *Get general sFlow graphs, type: traffic
 */
function apiSflowTrafficParsing(oData) {
	document.getElementById("printSflow").innerHTML ="<iframe id='sFlowTraffic' src='http://0.0.0.0:8008/app/dashboard-example/html/' style='border:none; height:100%; width:100%; position:absolute;''></iframe>";

}


/*
 *Get OpenVswitch version (on Welcome)
 */
function apiWelcomeParsing1(oData) {
	var parsedData = oData.split(" ")[3].split("C")[0]; //get only version number
	if (parsedData<"2.8") {
		document.getElementById("printSpace").innerHTML = "<b>OVS Version:</b><br>" +parsedData;
		document.getElementById("printSpace").innerHTML +=" (compatible avec OpenFlow jusqu'à la version 1.3)<br>"
	}
	else {
		document.getElementById("printSpace").innerHTML = "<b>OVS Version:</b><br>" +parsedData;
		document.getElementById("printSpace").innerHTML +=" (compatible avec OpenFlow jusqu'à la version 1.4)<br>"
	}
	//source:http://docs.openvswitch.org/en/latest/faq/openflow/
}


/*
 *Get Mininet version (on Welcome)
 */
function apiWelcomeParsing3(oData) {
	document.getElementById("printSpace").innerHTML += "<br><b>Mininet Version:</b><br>" +oData+ "<br>";
}


/*
 *Get all switches and hosts (on Welcome)
 */
var arrayOfHosts;	//declared outside to set its scope broader 
var arrayOfSwitches;	//declared outside to set its scope broader 
function apiWelcomeParsing2(oData) {
	arrayOfSwitches = oData.toString().trim().replace(/(\r?\n|\n|\r)/gm," ").split(" ");  			//arrayOfSwitches is an array containing switches names
	arrayOfHosts = oData.toString().trim().replace(/(\r?\n|\n|\r)/gm," ").replace(/s/g,"h_").split(" ");	// arrayOfHosts is an array containing hosts names
	console.log(arrayOfSwitches);
	console.log(arrayOfHosts);
	document.getElementById("printSpace").innerHTML += "<br><b>Nombre de switches présents sur la carte:</b><br>" +arrayOfSwitches.length;
}


/*
 *Calcul du barycentre des switches
 */
function calculerBarycentre(a,b){
	var pointA = JSON.parse(a);
	var pointB = JSON.parse(b);
	
	var barycentre = new Object();
	barycentre.x=(pointA.x+pointB.x)/2;
	
	barycentre.y=(pointA.y+pointB.y)/2;
	return barycentre;

}
function calculerBarycentreDesSwitch(geoJson){
        var json = JSON.parse(geoJson);
	var features = json.features;
	var premierefois = true;
	var barycentre;
	for(i=0;i<features.length;i++){
		var geometry = features[i].geometry;
		if("Point"==geometry.type){
			var point = new Object();
			point.x=geometry.coordinates[0];
			point.y=geometry.coordinates[1];
			console.log(point);
			if(premierefois){
				barycentre = point;
				premierefois = false;
			}
			barycentre = calculerBarycentre(JSON.stringify(barycentre),JSON.stringify(point));
		}
	}
	console.log(barycentre);
	return barycentre;
}