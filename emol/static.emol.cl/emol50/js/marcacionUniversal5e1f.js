//ga

/*
Creado por Leonel Solar 2015
*/

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-8908154-1']);
_gaq.push(['_setDomainName', '.emol.com']);
// _gaq.push(['_setCampSourceKey', 'emoltest']);
// _gaq.push(['_setCampaignCookieTimeout', 0]);
_gaq.push(['_trackPageview']);
_gaq.push(['_trackPageLoadTime']);

var _paq = _paq || [];


function registraGA(codcanal, area){
	switch(codcanal){
		case "0": //POR;
			_gaq.push(['p._setAccount', 'UA-27345792-1']);
			_gaq.push(['p._setDomainName', '.emol.com']);
			_gaq.push(['p._trackPageview', area]);
			_gaq.push(['p._trackPageLoadTime']);
			break;
		case "1": //NAC;
		case "29":
		case "30":
		case "32":
		case "33":
		case "34":
		case "35":
		case "36":
		case "39":
		case "41":
		case "42":
		case "43":
		case "44":
		case "45":
		case "47":
			_gaq.push(['f._setAccount', 'UA-27345792-6']);
			_gaq.push(['f._setDomainName', '.emol.com']);
			_gaq.push(['f._trackPageview', area]);
			_gaq.push(['f._trackPageLoadTime']);
			break;
		case "46":
			_gaq.push(['f._setAccount', 'UA-27345792-6']);
			_gaq.push(['f._setDomainName', '.emol.com']);
			_gaq.push(['f._setCustomVar',2,'Seccion_sesion','EducacionPSU',2]);
			_gaq.push(['f._setCustomVar',3,'Seccion_pvs','EducacionPSU',3]);
			_gaq.push(['f._trackPageview', area]);
			_gaq.push(['f._trackPageLoadTime']);			
			break;
		case "2": //INT;
			_gaq.push(['f._setAccount', 'UA-27345792-6']);
			_gaq.push(['f._setDomainName', '.emol.com']);
			_gaq.push(['f._trackPageview', area]);
			_gaq.push(['f._trackPageLoadTime']);
			break;
		case "3": //ECO;
		case "48":
		case "49":
		case "50":
		case "51":
		case "52":
		case "53":
			_gaq.push(['c._setAccount', 'UA-27345792-3']);
			_gaq.push(['c._setDomainName', '.emol.com']);
			_gaq.push(['c._trackPageview', area]);
			_gaq.push(['c._trackPageLoadTime']);
			break;
		case "4": //DEP
		case "7":
		case "8":
		case "9":
		case "10":
		case "54":
			_gaq.push(['d._setAccount', 'UA-27345792-4']);
			_gaq.push(['d._setDomainName', '.emol.com']);
			_gaq.push(['d._trackPageview', area]);
			_gaq.push(['d._trackPageLoadTime']);
			break;
		case "5": //TEC
			_gaq.push(['g._setAccount', 'UA-27345792-9']);
			_gaq.push(['g._setDomainName', '.emol.com']);
			_gaq.push(['g._trackPageview', area]);
			_gaq.push(['g._trackPageLoadTime']);
			break;
		case "6": 	//ESPC
		case "11": 	
		case "22": 	
		case "23": 	
		case "24": 	
		case "25": 	
		case "26": 	
		case "27": 	
		case "28": 	
		case "105": 
			_gaq.push(['e._setAccount', 'UA-27345792-5']);
			_gaq.push(['e._setDomainName', '.emol.com']);
			_gaq.push(['e._trackPageview', area]);
			_gaq.push(['e._trackPageLoadTime']);
			break;
		case "12": //TYM
		case "13": 
		case "14": 
		case "15": 
		case "16": 
		case "17": 
		case "18": 
		case "19": 
		case "20": 
		case "21":
		case "55":		
		case "79": 
		case "80": 
		case "81": 
		case "82":  
			_gaq.push(['m._setAccount', 'UA-27345792-8']);
			_gaq.push(['m._setDomainName', '.emol.com']);
			_gaq.push(['m._trackPageview', area]);
			_gaq.push(['m._trackPageLoadTime']);
			break;
		case "84":
			_gaq.push(['m._setAccount', 'UA-27345792-8']);
			_gaq.push(['m._setDomainName', '.emol.com']);
			_gaq.push(['m._setCustomVar',2,'Seccion_sesion','Viajes',2]);
			_gaq.push(['m._setCustomVar',3,'Seccion_pvs','Viajes',3]);
			_gaq.push(['m._trackPageview', area]);
			_gaq.push(['m._trackPageLoadTime']);			
			break;
		case "56": //SERV
		case "57": 
		case "58": 
		case "59": 
		case "61": 
			_gaq.push(['s._setAccount', 'UA-27345792-10']);
			_gaq.push(['s._setDomainName', '.emol.com']);
			_gaq.push(['s._trackPageview', area]);
			_gaq.push(['s._trackPageLoadTime']);
			break;
		case "62": //FOTOS 16
		case "63":
		case "64":
		case "65":
		case "66":
		case "67":
		case "68":
		case "69":
		case "70":
		case "72":
			_gaq.push(['r._setAccount', 'UA-27345792-7']); 
			_gaq.push(['r._setDomainName', '.emol.com']); 
			_gaq.push(['r._trackPageview', area]); 
			_gaq.push(['r._trackPageLoadTime']);
			break;
		case "85":
		case "86":
		case "87":
		case "88":
		case "89":
		case "92":
		case "97":
		case "103":
			_gaq.push(['r._setAccount', 'UA-27345792-17']); 
			_gaq.push(['r._setDomainName', '.emol.com']); 
			_gaq.push(['r._trackPageview', area]); 
			_gaq.push(['r._trackPageLoadTime']);
			break;
		case "104":
			_gaq.push(['r._setAccount', 'UA-27345792-17']); 
			_gaq.push(['r._setDomainName', '.emol.com']); 
			_gaq.push(['r._setCustomVar',2,'Seccion_sesion','Transporte',2]);
			_gaq.push(['r._setCustomVar',3,'Seccion_pvs','Transporte',3]);
			_gaq.push(['r._trackPageview', area]); 
			_gaq.push(['r._trackPageLoadTime']);
			break;
		case "90":
			//especiales
			break;
		case "91": 
			_gaq.push(['l._setAccount', 'UA-27345792-13']);
			_gaq.push(['l._setDomainName', '.emol.com']);
			_gaq.push(['l._trackPageview', area]);
			_gaq.push(['l._trackPageLoadTime']); //multimedia
			break;
		case "93":
		case "94":
		case "95":
		case "96":
		case "98":
			_gaq.push(['l._setAccount', 'UA-27345792-18']);
			_gaq.push(['l._setDomainName', '.emol.com']);
			_gaq.push(['l._trackPageview', area]);
			_gaq.push(['l._trackPageLoadTime']); //360
			break;
		case "98":
			//sin Marcacion especiales
			break;
		case "99":
			//sin Marcacion;
			break;
		case "comentarista":
			_gaq.push(['l._setAccount', 'UA-27345792-19']);
			_gaq.push(['l._setDomainName', '.emol.com']);
			_gaq.push(['l._trackPageview', area]);
			_gaq.push(['l._trackPageLoadTime']);
			break;
	}
};

function registraGANombre(nombrecanal, area){
	var codcanal="0";
	switch(nombrecanal.toLowerCase()){
	case "": //POR;
		codcanal="0";
	break;
	case "nacional": //POR;
		codcanal="1";
	break;
	case "internacional","mundo": //POR;
		codcanal="2";
	break;
	case "economia","negocios": //POR;
		codcanal="3";
	break;
	case "deportes": //POR;
		codcanal="4";
	break;
	case "tecnologia": //POR;
		codcanal="5";
	break;
	case "magazine": //POR;
		codcanal="6";
	break;
	case "fotoshd","mundografico": //POR;
		codcanal="24";
	break;
	case "infografias": //POR;
		codcanal="25";
	break;
	case "tendencias": //POR;
		codcanal="7";
	break;
	case "actualidad": //POR;
		codcanal="1";
	break;
	}
	registraGA( codcanal, area);
};

function recordOutboundLink(link, category, action, label) {
	try {
	_gaq.push(['_setAccount', 'UA-8908154-1']);
	_gaq.push(['_setDomainName', '.emol.com']);
	_gaq.push(['_trackEvent',category,action,label,1,true]);
	setTimeout('document.location = "' + link.href + '"', 200)
	}catch(err){}
};	

function recordOutboundLinkTarget(link, category, action, label) {
	try {
	_gaq.push(['_setAccount', 'UA-8908154-1']);
	_gaq.push(['_setDomainName', '.emol.com']);
	_gaq.push(['_trackEvent',category,action,label,1,true]);
	//setTimeout('document.location = "' + link.href + '"', 200)
	window.open(link.href,"_blank","");
	
	}catch(err){}
};

function MarcaPiwik(codcanal, ruta){
	var host = "http://www.emol.com/";
	var valida = false;
	var valida = vfunc(ruta);
	
	if(!valida)
	{
		switch(codcanal){
			case "0": //POR
				_paq.push(['setCustomUrl', host+'/home/']);
				break;
			case "1": //NAC
			case "29":
			case "30":
			case "32":
			case "33":
			case "34":
			case "35":
			case "36":
			case "39":
			case "41":
			case "42":
			case "43":
			case "44":
			case "45":
			case "46":
			case "47":
				_paq.push(['setCustomUrl', host+'/nacional/portada/']);
				break;
			case "2": //INT
				_paq.push(['setCustomUrl', host+'/internacional/portada/']);
				break;
			case "3": //ECO
			case "48":
			case "49":
			case "50":
			case "51":
			case "52":
			case "53":
				_paq.push(['setCustomUrl', host+'/economia/portada/']);
				break;
			case "4": //DEP
			case "7":
			case "8":
			case "9":
			case "10":
			case "54":
				_paq.push(['setCustomUrl', host+'/deportes/portada/']);
				break;
			case "5": //TEC
				_paq.push(['setCustomUrl', host+'/tecnologia/portada/']);
				break;
			case "6": 	//ESPEC
			case "11": 	
			case "22": 	
			case "23": 	
			case "24": 	
			case "25": 	
			case "26": 	
			case "27": 	
			case "28": 	
			case "105":
				_paq.push(['setCustomUrl', host+'/espectaculos/portada/']);
				break;
			case "12":  //TEN
			case "13":
			case "14":
			case "15":
			case "16":
			case "17":
			case "18":
			case "19":
			case "20":
			case "21":
			case "55":
			case "79":
			case "80":
			case "81":
			case "82":
			case "84":
				_paq.push(['setCustomUrl', host+'/tendencias/portada/']);
				break;
			case "56": //SER
			case "57": 
			case "58": 
			case "59": 
			case "61": 
				_paq.push(['setCustomUrl', host+'/servicios/portada/']);
				break;
			case "62": //FOTOS
			case "63":
			case "64":
			case "65":
			case "66":
			case "67":
			case "68":
			case "69":
			case "70":
			case "72":
				_paq.push(['setCustomUrl', host+'/fotos/portada/']);
				break;
			case "85":
			case "86":
			case "87":
			case "88":
			case "89":
			case "92":
			case "97":
			case "103":
			case "104":
				_paq.push(['setCustomUrl', host+'/autos/portada/']);
				break;
			case "90":
				//especiales
				break;
			case "91": 
				_paq.push(['setCustomUrl', host+'/multimedia/portada/']);
				break
			case "98":
				//sin Marcacion especiales
				break;
			case "99":
				//sin Marcacion;
				break;
			case "comentarista":
				_paq.push(['setCustomUrl', 'https://comentarista.emol.com/']);
				break;
		}
	}else{
		var seccion = buscaseccion(codcanal);
		if(ruta.indexOf('http://www.emol.com/especiales/') != -1){
			_paq.push(['setCustomUrl', host+'/'+seccion+'/'+ruta.split('http://www.emol.com/')[4]+'/']);
		}else{
			_paq.push(['setCustomUrl', host+'/'+seccion+'/'+ruta.split('http://www.emol.com/')[6]+'/']);
		}
	}
	_paq.push(['setCookieDomain', '*.emol.com']);
	_paq.push(['setDomains', '*.emol.com']);
	_paq.push(['trackPageView']);
	_paq.push(['enableLinkTracking']);
};

function vfunc(ruta){
	var bool = false;
	if(ruta.indexOf("http://www.emol.com/especiales/") >= 0){
		bool = true;
	}
	if(ruta.indexOf("http://www.emol.com/noticias/") >= 0){
		bool = true;
	}
	return bool;
};

function buscaseccion(codcanal){
	switch(codcanal){
		case "1": //NAC;
			return "nacional";
			break;
		case "2": //INT;
			return "internacional";
			break;
		case "3": //ECO;
			return "economia";
			break;
		case "4": //DEP
			return "deporte";
			break;
		case "5": //TEC
			return "tecnologia";
			break;
		case "6": //MAG;
			return "espectaculos";
			break;
		case "7": //MAG;
			return "tendencias";
			break;
		case "16": //FOT;
			return "fotos";
			break;
	}
};

//analytics
(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();	

//pram
(function() {
  var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;
  s.src = 'http://apps.emol.com/bt/rdb.pram.v1.js?' + Math.random();
  var c = document.getElementsByTagName('script')[0]; c.parentNode.insertBefore(s, c);
})();

//piwik 
(function() {
	var u="https://analytics.emol.ecn.cl/";
	_paq.push(['setTrackerUrl', u+'piwik.php']);
	_paq.push(['setSiteId', 1]);
	var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
	g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
})();