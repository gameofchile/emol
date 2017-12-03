//economicos js 
var slideEconomicos;

var defaults = {
	"sliding_speed": 500,
	"sliding_time": 2500,
	"banner_link": "http://www.economicos.cl"
};

var fechaEscrita = function(date_str) {
    if (!date_str) {return;}
    date_str = $.trim(date_str);
    date_str = date_str.replace(/\.\d\d\d+/,""); // remove the milliseconds
    date_str = date_str.replace(/-/,"/").replace(/-/,"/"); //substitute - with /
    date_str = date_str.replace(/T/," ").replace(/Z/," UTC"); //remove T and substitute Z with UTC
    date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // +08:00 -> +0800
    var parsed_date = new Date(date_str);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date(); //defines relative to what ..default is now
	
    var delta = parseInt((relative_to.getTime()-parsed_date)/1000);
    delta=(delta<2)?2:delta;
    var r = '';
    if (delta < 60) {
    r = delta + ' segundos';
    } else if(delta < 120) {
    r = ' unos minutos';
    } else if(delta < (45*60)) {
    r = (parseInt(delta / 60, 10)).toString() + ' minutos';
    } else if(delta < (2*60*60)) {
    r = ' una hora';
    } else if(delta < (24*60*60)) {
    r = '' + (parseInt(delta / 3600, 10)).toString() + ' horas';
    } else if(delta < (48*60*60)) {
    r = 'un d&iacute;a';
    } else {
    r = (parseInt(delta / 86400, 10)).toString() + ' d&iacute;as';
    }
    return 'hace ' + r;
};

function processquery300(destiny, template, utm_source, utm_medium, utm_campaign, query) {
	
	var qy = JSON.stringify(query);
	$.ajax({ 
		type: "get", 
		async: false,
		url: "http://cache-elastic.ecn.cl/clasificados,automoviles,propiedades/_search?", 
		data: {source: qy}, 
		dataType: "jsonp", 
		cache: true,
		jsonp: 'callback',
		jsonpCallback: 'jsonpCallback300',
		success: function(data) {
			showresults300(data, destiny, template, utm_source, utm_medium, utm_campaign);
		}
	});
}

var showresults300 = function(sdata, destiny, template, utm_source, utm_medium, utm_campaign) {
	var data = parseresults(sdata);
	var html = '';
	var result_list300 = '';
	
	for(var i=0; i < data.records.length; i++) {
		
		// thumbnail no image url fix
		// if( data.records[i]._source.thumbnail.search("imgcf.ecn.cl")==-1) {
		if( data.records[i]._source.thumbnail.search("imgcf.ecn.cl")==-1 && data.records[i]._source.thumbnail.search("imgb2bautos")==-1) {
			var thumbUrl = data.records[i]._source.thumbnail.replace("http://","").replace("https://","");
			thumbUrl =encodeURI(thumbUrl);
			data.records[i]._source.thumbnail="http://proxyimg.ecn.cl/120/"+encodeURIComponent(thumbUrl);
		}
		
		data.records[i]._source.thumbnail=data.records[i]._source.thumbnail.replace("imgcf.ecn.cl","images.ecn.cl");
		if(data.records[i]._source.thumbnail == '/img/no_image.png') data.records[i]._source.thumbnail = 'http://www.economicos.cl/img/no_image.png';		

		// site url fix
		var url = (data.records[i]._index == 'automoviles')? 'http://www.emol.com/vehiculos/' + data.records[i]._id +  data.records[i]._source.url : 'http://www.economicos.cl/' + data.records[i]._source.mercado.toLowerCase().replace(/ /g,"-") + data.records[i]._source.url + '?utm_source=' + utm_source + '&utm_medium=' + utm_medium + '&utm_campaign=' + utm_campaign;

		// ubicacion
		var ubicacion = '';
		if(typeof data.records[i]._source.comuna != undefined) ubicacion = data.records[i]._source.comuna;

		if(ubicacion == '') {
			if(typeof data.records[i]._source.region != undefined) ubicacion = data.records[i]._source.region;
		}

		// city fix
		var city = data.records[i]._source.region;
		if(data.records[i]._source.comuna) city = data.records[i]._source.comuna;

		
		if (window.location.pathname.indexOf("/noticias/") > -1)
		{
			result_list300 += '<article class="flo_left cont_nota_relacionada"><span class="flo_left cont_descrip_icons icon_reloj"><span class="flo_left text_seccion" title="'+data.records[i]._source.fechaPrimeraPub+'">Publicado '+fechaEscrita(data.records[i]._source.fechaPrimeraPub)+'</span></span><div class="flo_left content_img_noticia"><div class="flo_left cont_ecn_img_int"><a href="'+url+'" target="_blank"><img src="'+data.records[i]._source.thumbnail+'" alt="imagen" title="'+data.records[i]._source.titulo+'"></a></div></div><div class=" cont_descrip_noticia"><h2><a href="'+url+'" target="_blank">'+data.records[i]._source.titulo.replace(/\$.*/,'')+'</a></h2></div><span class="flo_left text_seccion ecn_precio"><a href="'+url+'" target="_blank">$'+data.records[i]._source.precioCLP+'</a></span></article>';
		}
		else
		{
			result_list300 += '<article class="flo_left cont_nota_relacionada"><span class="flo_left cont_descrip_icons icon_reloj"><span class="flo_left text_seccion" title="'+data.records[i]._source.fechaPrimeraPub+'">Publicado '+fechaEscrita(data.records[i]._source.fechaPrimeraPub)+'</span></span><div class="flo_left content_img_noticia"><div class="flo_left cont_ecn_img_int"><a href="'+url+'" target="_blank"><img src="'+data.records[i]._source.thumbnail+'" alt="imagen" title="'+data.records[i]._source.titulo+'"></a></div></div><div class=" cont_descrip_noticia"><h2><a href="'+url+'" target="_blank">'+data.records[i]._source.titulo.replace(/\$.*/,'')+'</a></h2></div><span class="flo_left text_seccion ecn_precio"><a href="'+url+'" target="_blank">$'+data.records[i]._source.precioCLP+'</a></span></article>';
		
		}
		
		

	}	
	$(destiny).html(result_list300);
};

var parseresults = function(dataobj) {
    var resultobj = new Object();
    resultobj["records"] = new Array();
    for ( var item = 0; item < dataobj.hits.hits.length; item++ ) {
		resultobj["records"].push(dataobj.hits.hits[item]);
    }
    return resultobj;
};

(function (){
	processquery300('#result_list300','#template', 'widget-emol', 'sidebar', 'sidebar+emol', {"query":{"bool":{"must":[{"term":{"orden":"3"}},{"range":{"fechaExpiracion":{"from":ahora()}}},{"range":{"fechaPrimeraPub":{"to":ahora()}}}]}},"size":4,"sort":[{"fechaPrimeraPub":{"order":"desc"}}]});
})();