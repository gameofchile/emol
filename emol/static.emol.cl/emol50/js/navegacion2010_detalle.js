//-----------------------------------------------------------------------
// Navegación de Thumbnails, LightBox y Play-Presentación
// Fotos EMOL 3.0
// marzo 2008
// Desarrollado por Gustavo Vargas Retamal
// Departamento de Desarrollo TI Internet - El Mercurio
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
function Comscore()
{
	 var _comscore = _comscore || [];
	_comscore.push({ c1: "2", c2: "6906471" });
	(function() {
    var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;
    s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";
    el.parentNode.insertBefore(s, el);
	})();
}

var indiceFOTOPREVIA=1;

function ActivaAddThis(Url,title,indiceFOTOACTUAL) 
{
    eval('svcs = { url: "' + Url + '", title: "'+title+'" }');
	var titleFace = rtrim(ltrim(title));
    titleFace = encodeURIComponent(title);
	var URLsola = Url;
	Url = encodeURIComponent(Url);
	
	//title = title.replace("ñ","&ntilde;");
	//title = title.replace("ó","&oacute;");
	

	//document.getElementById("fb_share").href="http://www.facebook.com/sharer.php?u="+Url+"&t="+titleFace;
	//-----Boton face Incrustado Comentado-2
	//document.getElementById("fb_share2").href="http://www.facebook.com/sharer.php?u="+Url+"&t="+titleFace+"&src=sp";
	//document.getElementById("fb_share2").setAttribute("share_url",URLsola);
	//----------------------------------------------------------------------------------------------------------------
	
	addthis.toolbox('#div_gals_fix_h1_c3', {}, svcs);
	//document.getElementById("tw_share").href="http://twitter.com/share?url="+escape(Url);
	//document.getElementById("div_gals_fix_h1_c1").innerHTML='<a class="addthis_button_tweet" tw:count="horizontal" tw:via="emol" tw:url="' + escape(Url) + '" tw:title="' + escape(title) + '"></a>'
	//document.getElementById("div_gals_fix_h1_c1").innerHTML=sc+'<div><a href="http://twitter.com/share?url='+escape(Url)+'&amp;via=emol" class="twitter-share-button">Tweet</a></div>';
	//document.getElementById("div_gals_fix_h1_c1").innerHTML='<a class="addthis_button_tweet" tw:count="horizontal" tw:lang="es" tw:url="'+Url+'" tw:via="emol"></a>';
	//addthis.toolbox('#div_gals_fix_h1_c1', {}, svcs);
	document.getElementById("tweetmg").innerHTML='<img width="16" height="16" src="imagenes_2010/twitter.gif" alt="tweetShare"><a href="http://twitter.com/share?url='+Url+'&text='+titleFace+'&via=emol" target="_blank">TWITTER</a>';
	addthis.toolbox('#tweetmg', {}, svcs);
	//addthis.button('.addthis_button_tweet');
	//document.getElementById("div_galeria_columnader_publi").innerHTML="<scr"+"ipt language=""jav"+"ascript"" type=""text/ja"+"vascript"" src=""http://banners.emol.com/tags/mundografico/robpg_01.js""></s"+"cript>";
	
	//publicidad
	//if(indiceFOTOACTUAL >= 4)
	//{
	//	var resultado = indiceFOTOACTUAL % 4;
	//	if(resultado==0)
	//	{
	//		document.getElementById("iframePubli").src="/mundografico/include_2010/publicidad.asp";
	//	}
	//}
}
function ltrim(s) {
	return s.replace(/^\s+/, "");
}

function rtrim(s) {
	return s.replace(/\s+$/, "");
}

function encoding(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
		return string;
}

function viewFoto(RowIndex)
{
	//Carga la foto
	generar_foto(arrDATA[RowIndex][1],arrDATA[RowIndex][2],arrDATA[RowIndex][3],arrDATA[RowIndex][4],arrDATA[RowIndex][5],RowIndex,this);
	//Mostrar mensaje: "Foto x de xx"
	document.getElementById("div_galeria_fotodesde").innerHTML= "Fotos "+ (RowIndex) +" de "+ MAXFOTOS +"";
	
	//Marca CERTIFICA
	//tagCertifica( 13947, arrDATA[RowIndex][0]); 
	//cert_registerHit(13947, arrDATA[RowIndex][0],'cert_Pivot'); 
	//Comscore
	//Comscore();
	/*
	_comscore.push({ c1: "2", c2: "6906471" });
	 (function() {
    var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;
    s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";
    el.parentNode.insertBefore(s, el);
	})();
	*/
	//console.log("registro coms");

	 //Marca GoogleAnalitics
	 //_gaq.push(['_trackPageview']);
	 _gaq.push(['_trackEvent','Fotos-Detalle de Noticia','clic-foto',document.URL,1,true]);
}

function viewFotoSinCertifica(RowIndex)
{
	//Carga la foto
	generar_foto(arrDATA[RowIndex][1],arrDATA[RowIndex][2],arrDATA[RowIndex][3],arrDATA[RowIndex][4],arrDATA[RowIndex][5],RowIndex,this);
	//Mostrar mensaje: "Foto x de xx"
	document.getElementById("div_galeria_fotodesde").innerHTML= "Fotos "+ (RowIndex) +" de "+ MAXFOTOS +"";

}
//-----------------------------------------------------------------------

function generar_foto(imagename,title,description,credito,fecha,RowIndex,inputObj)
{
	RowPrev = RowIndex-1;
	RowNext = RowIndex+1;
	indiceFOTOACTUAL = RowIndex;
	if (RowPrev<=1)
	{
		RowPrev=0;
	}
	
	// cambiar acá por el maximo de fotos de la galeria
	if (RowNext>=MAXFOTOS)
	{
		//RowNext=MAXFOTOS;
		RowNext=MAXFOTOS-1;
	}
	
    //Div de Hover
	var newHTML="";
	newHTML = newHTML + '<a href="javascript:RetrocedeFoto(RowPrev);" id="prevLink"><img src="http://static.emol.cl/emol50/img/blank.gif" border=0></a>';
	newHTML = newHTML + '<a href="javascript:AvanzaFoto(RowNext);" id="nextLink"><img src="http://static.emol.cl/emol50/img/blank.gif" border=0></a>';
	gethoverobjnostyle().innerHTML = newHTML;
	
	//Cambio de Foto
	document.getElementById("iFoto").src=imagename;
	document.getElementById("iFoto").alt=title.replace('\"','').replace('\'','');

	//Cambio de Titulo / Descripcion
	document.getElementById("div_galeria_columnader_txt").innerHTML="<div class=\"div_galeria_textos_h1\">"+title+"</div><p>"+description+"</p>";
	//Cambio Texto Foto
	document.getElementById("div_galeria_credito").innerHTML="Fotos: "+credito+" | actualizado el "+fecha;
	//ActivaAddThis("http://www.emol.com/mundografico/index.asp?F_ID="+arrDATA[RowIndex][7],title,indiceFOTOACTUAL);
	
	//Cambio de estilo para foto destacada 2011-02-25
	var NombreEstilo = "file_"+ indiceFOTOACTUAL +"_foto";
	//LIMPIA ESTILOS
	for (i = 1; i<= MAXFOTOS; i++)
	{
		var NNi = "file_"+ i +"_foto";
		document.getElementById(NNi).className = "div_galeria_foto_th";
	}
	//DESTACA ESTILO
	document.getElementById(NombreEstilo).className = "div_galeria_foto_th_selec";
}

function gethoverobjnostyle()
{
	if (document.getElementById)
	return document.getElementById("hoverNav")
	else if (document.all)
	return document.all.hoverNav
}

//-----------------------------------------------------------------------
function AvanzaFoto(IndiceUltimaFoto_dePag)
{
	indiceFOTOPREVIA = indiceFOTOACTUAL;
	indiceFOTOACTUAL++;
	if (indiceFOTOACTUAL > MAXFOTOS)
	{
		// está en la última foto
		indiceFOTOACTUAL = MAXFOTOS+1;
		indiceFOTOPREVIA = MAXFOTOS-1;
	}
	
	if (indiceFOTOACTUAL >= (IndiceUltimaFoto_dePag+2))
	{
		indiceFOTOACTUAL = indiceFOTOACTUAL-1;
		//indiceFOTOACTUAL = 1;
		viewDivPage(arrDATA[(indiceFOTOACTUAL)][6],-1)
		//alert("avanza pagina");
	}
	else
	{
		viewFoto(indiceFOTOACTUAL);
		
		//if (indiceFOTOACTUAL == IndiceUltimaFoto_dePag+1)
		//{
			viewDivPage(arrDATA[indiceFOTOACTUAL][6], arrDATA[indiceFOTOPREVIA][6])
			//alert("avanza pagina");
		//}
	}
}

//-----------------------------------------------------------------------
function RetrocedeFoto(IndicePrimeraFoto_dePag)
{
	indiceFOTOANTERIOR = indiceFOTOACTUAL;
	indiceFOTOACTUAL--;
	if (indiceFOTOACTUAL <= 0) 
	{
		indiceFOTOACTUAL = 1;
	}
	viewFoto(indiceFOTOACTUAL);
	//if (indiceFOTOACTUAL == IndicePrimeraFoto_dePag)
	//{
		viewDivPage_3(arrDATA[indiceFOTOACTUAL][6],arrDATA[indiceFOTOPREVIA][6])
		//alert("retrocede pagina");
	//}
}

//-----------------------------------------------------------------------
function AvanzaPagina()
{
	indicePAGPREVIA = indicePAGFOTOACTUAL;
	indicePAGFOTOACTUAL++;
	if (indicePAGFOTOACTUAL >= MAXPAGINAS)
	{
	// está en la última foto
	 indicePAGFOTOACTUAL = MAXPAGINAS;
	 indicePAGPREVIA = MAXPAGINAS-1;
	}
	viewDivPage_2(indicePAGFOTOACTUAL,-1)
	//alert("avanza pagina");
}

//-----------------------------------------------------------------------
function RetrocedePagina()
{
	indicePAGPREVIA = indicePAGFOTOACTUAL;
	indicePAGFOTOACTUAL--;
	if (indicePAGFOTOACTUAL <= 0) 
	{
	 indicePAGFOTOACTUAL = 1;
	}
	viewDivPage_2(indicePAGFOTOACTUAL,-1)
}
//-----------------------------------------------------------------------
function viewDivPage_2(intDIVmostrar, fotoMostrarPorDefecto)
{
	 var OriginalDivMostar = intDIVmostrar;
	 var strDIVmostrar='DIVPAG'+intDIVmostrar;
	 var strDIVocultar='DIVPAG'+(intDIVmostrar-1);
	 var strDIVocultar2='DIVPAG'+(intDIVmostrar+1);

	 if(OriginalDivMostar>1)
	 {
		document.getElementById(strDIVocultar).style.display='none';
	 }

	 if(OriginalDivMostar<MAXPAGINAS)
	 {
		document.getElementById(strDIVocultar2).style.display='none';
	 }

	document.getElementById(strDIVmostrar).style.display='block';

	 if(fotoMostrarPorDefecto==-1)
	 {
		for (i=0; fotoMostrarPorDefecto==-1; i++)
		{
			if (arrDATA[i][6]==OriginalDivMostar)
			{
				fotoMostrarPorDefecto=i;
			}
		}
		viewFoto(fotoMostrarPorDefecto);
	 }
} 
//-----------------------------------------------------------------------
function viewDivPage(intDIVmostrar, fotoMostrarPorDefecto)
{
	var Original = intDIVmostrar;
	var SumaOrg = parseInt(intDIVmostrar)+1;
	var RestaOrg = parseInt(intDIVmostrar)-1;
	var strDIVmostrar="DIVPAG"+intDIVmostrar;
	var strDIVocultar="DIVPAG"+SumaOrg;
	var strDIVocultar2="DIVPAG"+RestaOrg;

	if (Original>1)
	{
		if (Original<MAXPAGINAS)
		{
			try
			{
				document.getElementById(strDIVocultar2).style.display='none';
				document.getElementById("DIVPAG1").style.display='block';
			}catch(err){}
		}
		else
		{
			try
			{
				document.getElementById(strDIVocultar2).style.display='none';
				document.getElementById(strDIVmostrar).style.display='block';
			}catch(err){}
		}
	}
	else
	{
		try 
		{
			document.getElementById(strDIVocultar2).style.display='none';
			document.getElementById("DIVPAG1").style.display='block';
		}catch(err){}
	}
	
	if (fotoMostrarPorDefecto==-1)
	{
		for (i=0; fotoMostrarPorDefecto==-1; i++)
		{
		if (arrDATA[i][6]==(Original-1))
		   {
		   fotoMostrarPorDefecto=i;
		   }
		}
		viewFoto(fotoMostrarPorDefecto);
		try
		{
			document.getElementById(strDIVocultar2).style.display='none';
			document.getElementById(strDIVmostrar).style.display='none';
			document.getElementById("DIVPAG1").style.display='block';
			document.getElementById(strDIVocultar).style.display='none';			
			
		}
		catch(err)
		{
		}
	}
}

function viewDivPage_3(intDIVmostrar, fotoMostrarPorDefecto)
{
	var Original = intDIVmostrar;
	var SumaOrg = parseInt(intDIVmostrar)+1;
	var RestaOrg = parseInt(intDIVmostrar)-1;
	var strDIVmostrar="DIVPAG"+intDIVmostrar;
	var strDIVocultar="DIVPAG"+SumaOrg;
	var strDIVocultar2="DIVPAG"+RestaOrg;

	if (Original>1)
	{
		if (Original<MAXPAGINAS)
		{
			document.getElementById(strDIVocultar).style.display='none';
			document.getElementById("DIVPAG1").style.display='block';
		}
		else
		{
			//alert(strDIVocultar);
			$('#'+strDIVocultar).css("display", "none");
			//document.getElementById(strDIVocultar).style.display='none';
			document.getElementById(strDIVmostrar).style.display='block';
		}
	}
	else
	{
		document.getElementById(strDIVocultar).style.display='none';
		document.getElementById("DIVPAG1").style.display='block';
	}
	
	if (fotoMostrarPorDefecto==-1)
	{
		for (i=0; fotoMostrarPorDefecto==-1; i++)
		{
		if (arrDATA[i][6]==(Original-1))
		   {
		   fotoMostrarPorDefecto=i;
		   }
		}
		viewFoto(fotoMostrarPorDefecto);
		try
		{
			document.getElementById(strDIVocultar).style.display='none';
			document.getElementById(strDIVmostrar).style.display='none';
			document.getElementById("DIVPAG1").style.display='block';
			document.getElementById(strDIVocultar2).style.display='none';			
			
		}
		catch(err)
		{
		}
	}
}