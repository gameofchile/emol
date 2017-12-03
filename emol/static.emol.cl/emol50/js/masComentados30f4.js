var buscaImagen = function(id){
	var urlElastic = "http://cache-elastic-pandora.ecn.cl/emol/noticia/_search?q=id:"+id;
	var imgSrcRet = [];
	
	$.ajax({
		type: "GET",
		url: urlElastic, 
		cache: true,
		async: false
	})
	.done( function(res){ 
		for(var i = 0; res.hits.hits.length > i; i++){
			var listImgSrcRet = {};
			var imgSrc = "";
			var data = res.hits.hits[i]._source.tablas.tablaMedios;
			$.each(data, function(i, ds){
				if(ds.IdTipoMedio == 1 && ds.Orden ==1){
					imgSrc = ds.Url;
					return true;
				}
			});
			if(imgSrc != ""){ 
				imgSrc = imgSrc.replace("staticemol.gen.emol.cl","static.emol.cl/emol50");
				if(detectmob()){
					imgSrc = imgSrc.replace(".jpg","http://www.emol.com/noticias/Nacional/2017/12/03/885860/_0lx0.jpg");				
				}else{
					if(window.location.pathname.indexOf("http://www.emol.com/noticias/") > -1){
						imgSrc = imgSrc.replace(".jpg","http://www.emol.com/noticias/Nacional/2017/12/03/885860/_0lx0.jpg");
					}else{
						imgSrc = imgSrc.replace(".jpg","http://www.emol.com/noticias/Nacional/2017/12/03/885860/_120x75.jpg");
					}
				}
			}else{
				try{
					imgSrc = "http://static.emol.cl/emol50/img/movil/" + getNombreSeccion(res.hits.hits[i]._source.seccion) +".png"
				}catch(err){
					imgSrc = "http://static.emol.cl/emol50/img/movil/panoramas.png";
				}
			}
			listImgSrcRet.imgSrc = imgSrc;
			listImgSrcRet.idNot = res.hits.hits[i]._source.id;
			imgSrcRet[imgSrcRet.length] = listImgSrcRet;
		}
	});	
	return imgSrcRet;
};

var getNombreSeccion = function(seccion){		
	switch (seccion) {
		case "Economía":
			seccionNomb = "economia";
			break;
		case "Tecnología":
			seccionNomb = "tecnologia";
			break;
		case "Espectáculos":
			seccionNomb = "espectaculos";
			break;
		case "*":
			seccionNomb = "seccion_emol";
			break;
		default:
			seccionNomb = seccion;
			break		
	}
	return seccionNomb;
};	

function listadoIdNoticia(data){
	var listArrImg = [];
	var listArrIdImgEnv = [];
	var list = {};
	
	for(var i = 0; data.length > i; i++){
		listArrIdImgEnv.push(data[i].cmsId);
	}
	
	var resbuscaImagen =  buscaImagen(listArrIdImgEnv.join('+OR+id:'));

	return resbuscaImagen;
};

function detectmob() { 	
	if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)){ 
		return true; 
	} else { 
		return false; 
	}
}

(function() {
  var urlData = "http://cache-comentarios.ecn.cl/Comments/Api?action=getMostCommentedPages&amp;site=emol";
  $.getJSON( urlData, { format: "json" })
   .done(function( data ){
		
		var arrImg = listadoIdNoticia(data);
		
		var html = "<div class=\"cont_tab_2015\"><div class=\"cont_tab_2015_tit\"><span class=\"cont_tab_2015_txt\">noticias m&aacute;s comentadas</span></div><div class=\"cont_int_secs_2015 cont_int_sec_pad_top\"><div class=\"cont_int_pad cont_int_sec_pad_side\">";
		
		var tamano = 10;
		
		if (typeof idSeccion != 'undefined' && idSeccion == 11 || window.location.pathname.indexOf("http://www.emol.com/noticias/") > -1){
			tamano = 10;
		}
		
		if(detectmob()){
			tamano = 6;					
		}			
		
		for(var i = 0; i < tamano; i++){
			if(data[i].cmsId != 882162 && data[i].cmsId != 815577 &&  (data[i].title).toLowerCase().indexOf("¡concurso!") == -1 &&  (data[i].title).toLowerCase().indexOf("concurso:") == -1 && (data[i].url).indexOf("soychile.cl") == -1){
				var img = "";
				$.each(arrImg, function(h, arr){
					if(arr.idNot == data[i].cmsId){
						img = arr.imgSrc;
						return true;
					}
				});				
				var permalink = (window.location.href.toLowerCase().indexOf("moderacion.aspx") > -1)?'/comentarios/Moderacion.aspx?page='+data[i].url:data[i].url;
				html = html + "<div class=\"caja_contenedor_masvistos_modulo\"><div class=\"caja_contenedor_masvistos_modulo_foto\"><a href=\""+permalink+"\"><img src=\""+img+"\" alt=\"\" height=\"40\" width=\"60\" border=\"0\"></a></div><div class=\"cont_contador_comentarios comentario_minimizado\" data-id=\""+data[i].cmsId+"\" style=\"display:block;\"><a href=\""+permalink+"#comentarios\"><div class=\"cont_int_comment_more\"><span class=\"cont_img_comment_mas_visto\"><img src=\"http://static.emol.cl/emol50/img/icon_comentarios.svg\"></span><span class=\"fb_comments_count comentario_plural\">"+data[i].totalCommentsCounter+"</span></div></a></div><div class=\"caja_contenedor_masvistos_modulo_texto\"><span class=\"caja_contenedor_masvistos_modulo_texto_color\"></span><a href=\""+permalink+"\">"+data[i].title+"</a></div></div>";	
			}						
		}
		
		html = html + "</div></div></div>";			
		$("#masComentados").html(html);			
		$("#masComentados").addClass('cont_n_mas_comt_emol');
    });
})();