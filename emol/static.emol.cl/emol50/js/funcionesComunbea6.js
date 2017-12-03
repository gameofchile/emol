var getNombreSeccion = function(seccion){		
	switch (seccion) {
		case "economia":
			seccionNomb = "economía";
			break;
		case "tecnologia":
			seccionNomb = "tecnología";
			break;
		case "espectaculos":
			seccionNomb = "espectáculos";
			break;
		default :
			seccionNomb = seccion;
			break;
	}
	return seccionNomb;
};

var ahora = function() {
    Stamp = new Date();
    var Year = Stamp.getYear();
    var Month = Stamp.getMonth() + 1;
    var Hours = Stamp.getHours();
    var Mins = Stamp.getMinutes();
    if (Year < 2000) Year = 1900 + Year;    
    if (Month < 10) Month = "0" + Month;
    if (Hours < 10) Hours = "0" + Hours;
    if (Mins < 10) Mins = "0" + Mins;
    
    var fecha = Year + '-'+ Month + '-' + Stamp.getDate() + 'T' + Hours + ':' + Mins + ':' + '00';
    return fecha;
};

var parseresults = function(dataobj) {
    var resultobj = new Object();
    resultobj["records"] = new Array();
    for ( var item = 0; item < dataobj.hits.hits.length; item++ ) {
		resultobj["records"].push(dataobj.hits.hits[item]._source);
    }
    return resultobj;
};  

function SetRelacionados(idTema, idNoticia, nombreTema){
	if(idTema !== "*"){
		var defaultESUrl = 'http://cache-elastic-pandora.ecn.cl/emol/noticia/_search?q=publicada:true';
		var url = defaultESUrl + '+AND+temas.id:' + idTema + '+AND+idPlantilla:1&sort=fechaModificacion:desc&size=5&fields=id,titulo,permalink';
		$.ajax(url).done(function (res) {
			if (res.hasOwnProperty('hits')) {
				var noticias = res.hits.hits;
				var html = '';
				for (var i = 0; i < noticias.length; i++) {
					var noticia = noticias[i].fields;				
					if(noticia.id[0] != idNoticia){
						html = html + '<div class=\"cont_iz_cuerpo_relacionados_listado_lista\"><a href=\"' + noticia.permalink[0] + '\">' + noticia.titulo[0] + '</a></div>'
					}				
				}
				$('#cont_iz_cuerpo_relacionados_listado').html(html);
				$('#cont_iz_cuerpo_relacionados').show();
				$('#LinkRelacionada').attr('href', "/tag/" + nombreTema.toSlug() + "/" + idTema + "/todas.aspx");
				$('#LinkTema').attr('href', "/tag/" + nombreTema.toSlug() + "/" + idTema + "/todas.aspx");
				$('#LinkTema').text(nombreTema);
			}
		});
	}	
};

var buscaImagen = function(id, seccion){
	var urlElastic = "http://cache-elastic-pandora.ecn.cl/emol/noticia/_search?q=id:"+id;
	var imgSrc = "";
	$.ajax({url: urlElastic, async: false}).done( function(res){ 
		var data = res.hits.hits[0]._source.tablas.tablaMedios;
		$.each(data, function(i, ds){
			if(ds.IdTipoMedio == 1){
				imgSrc = ds.Url;
				return true;
			}
		});
	} );
	if(imgSrc != ""){ 
		imgSrc = imgSrc.replace("staticemol.gen.emol.cl","static.emol.cl/emol50");
		imgSrc = imgSrc.replace(".jpg","_120x75.html");
	}
	else
	{	
		if (seccion != "*")
		{
			imgSrc = "http://static.emol.cl/emol50/img/movil/" + seccion + ".png";
		}
		else
		{
			imgSrc = "../../../../../../../static.emol.cl/emol50/img/movil/nacional.png";
		}
		
	}
	return imgSrc;
};

function MasComentadasSeccion(seccion){
	if(seccion =="autos" || seccion =="360")
	{
		var urlData = "http://cache-comentarios.ecn.cl/Comments/Api?action=getMostCommentedPages&site=emol&siteSection=" + seccion + "&days=7" ;
	}
	else
	{
		var urlData = "http://cache-comentarios.ecn.cl/Comments/Api?action=getMostCommentedPages&site=emol&siteSection=" + seccion;
	}
  $.getJSON( urlData, {
    format: "json"
  })
	.done(function( data ) {
		var html = ""		
		if(seccion=="internacional" || seccion=="tecnologia" || seccion=="espectaculos" || seccion=="tendencias")
		{
			html = "<div class=\"cont_tab_2015\"><div class=\"cont_tab_2015_tit\"><span class=\"cont_tab_2015_txt txt_especial\">+ comentado en "+ getNombreSeccion(seccion) +"</span></div><div class=\"cont_int_secs_2015 cont_int_sec_pad_top\"><div class=\"cont_int_pad cont_int_sec_pad_side\">";
		}
		else
		{
			html = "<div class=\"cont_tab_2015\"><div class=\"cont_tab_2015_tit\"><span class=\"cont_tab_2015_txt\">+ comentado en "+ getNombreSeccion(seccion) +"</span></div><div class=\"cont_int_secs_2015 cont_int_sec_pad_top\"><div class=\"cont_int_pad cont_int_sec_pad_side\">";
		}
		var comCount = 0;
		var tamano = 5;
		
		if (data.length < 5)
		{
			tamano = data.length;
		}
		
		for(var i = 0; i < tamano; i++)
		{			
			if (data[i].totalCommentsCounter != 0 && data[i].cmsId != 882162)
			{
				comCount++;
				var img = buscaImagen(data[i].cmsId,seccion);
				
				html = html + "<div class=\"caja_contenedor_masvistos_modulo\"><div class=\"caja_contenedor_masvistos_modulo_foto\"><a href=\""+data[i].url+"\"><img src=\""+img+"\" alt=\"\" height=\"40\" width=\"60\" border=\"0\"></a></div><div class=\"cont_contador_comentarios comentario_minimizado\" data-id=\""+data[i].cmsId+"\" style=\"display:block;\"><a href=\""+data[i].url+"#comentarios\"><div class=\"cont_int_comment_more\"><span class=\"cont_img_comment_mas_visto\"><img src=\"http://static.emol.cl/emol50/img/icon_comentarios.svg\"></span><span class=\"fb_comments_count comentario_plural\">"+data[i].totalCommentsCounter+"</span></div></a></div><div class=\"caja_contenedor_masvistos_modulo_texto\"><span class=\"caja_contenedor_masvistos_modulo_texto_color\"></span><a href=\""+data[i].url+"\">"+data[i].title+"</a></div></div>";
			}		
		}
		
		if(comCount !=0)
		{
			html = html + "</div></div></div>";
			$("#masComentados").html(html);
		}			
		
    });
};

function SetUltimoMinuto(seccion, size, subseccion){
	var defaultESUrl = 'http://cache-elastic-pandora.ecn.cl/emol/noticia/_search?q=publicada:true';
	var url;
	var lnkSeccion = seccion;
	if (seccion === '*') {
		$('#LinkUltimasNoticias').attr('href', '/todas');
		$('#LinkUltimasNoticiasTexto').attr('href', '/todas');
		
		url = defaultESUrl + '+AND+ultimoMinuto:true+AND+seccion:' + seccion + '+AND+subSeccion:' + subseccion + '&sort=fechaModificacion:desc&size=' + size + '&fields=titulo,permalink,fechaModificacion';
		
	} else {
		$('#LinkUltimasNoticias').attr('href', '/noticias/' + lnkSeccion + '/todas.aspx');
		$('#LinkUltimasNoticiasTexto').attr('href', '/noticias/' + lnkSeccion + '/todas.aspx');
		
		switch (seccion) {
		    case "economia":
				seccion = "economía";
				break;
			case "tecnologia":
				seccion = "tecnología";
				break;
			case "espectaculos":
				seccion = "espectáculos";
				break;
		}
		
		if(seccion == 'tendencias' || seccion == 'autos'){
			url = defaultESUrl + '+AND+seccion:' + seccion + '+AND+subSeccion:' + subseccion + '&sort=fechaModificacion:desc&size=' + size + '&fields=titulo,permalink,fechaModificacion';
		}else{
			url = defaultESUrl + '+AND+ultimoMinuto:true+AND+seccion:' + seccion + '+AND+subSeccion:' + subseccion + '&sort=fechaModificacion:desc&size=' + size + '&fields=titulo,permalink,fechaModificacion';
		}
		
	}
	$.ajax(url).done(function (res) {
		if (res.hasOwnProperty('hits')) {
			var noticias = res.hits.hits;
			var html = '';			
			for (var i = 0; i < noticias.length; i++) {
				var noticia = noticias[i].fields;
				var date = noticia.fechaModificacion[0].createDate().formatDate();
				html = html + '<div class=\"noticias_caja_texto\"><span class=\"noticias_hora\">' + date + '</span><a href=\"' + noticia.permalink[0] + '\">' + noticia.titulo[0] +'</a></div>';
			}
			$('#contNotUltMinuto').html(html);
			$('#cont_ultimominuto').show();
		}
	});
};

function masValoradas(seccion){

	var urlData = "http://cache-comentarios.ecn.cl/Comments/Api?action=getMostLiked&site=emol&section=" + seccion + "&days=1";
	var userId = getCookie("c_user_i");
	

	$.getJSON( urlData, {format: "json"}).done(function( data ){		
		var html = "<div class=\"cont_tab_2015\"><div class=\"cont_tab_2015_tit\"><span class=\"cont_tab_2015_txt\">Comentarios mas valorados en "+ getNombreSeccion(seccion) +"</span></div><div class=\"cont_int_pad cont_int_sec_pad_side\" id=\"masVal\">";
		
		//var comCount = 0;
		var tamano = 10;
		
		if (data.length < 10){
			tamano = data.length;
		}
			
		for(var i = 0; i < tamano; i++){	
			var date = new Date(data[i].time);
			var dateNow = new Date();
			var fecha;
			var imgPerfil;
			if(((date.getMonth() + 1) == (dateNow.getMonth() + 1))&&(date.getDate()==dateNow.getDate())&&(date.getFullYear()==dateNow.getFullYear())){
				fecha = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) ;
			}else{
				fecha = ('0' + date.getDate()).slice(-2)+ '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +date.getFullYear().toString().substr(-2);
			}
			
			if(data[i].avatar != undefined &&  data[i].avatar != 'undefined' && data[i].avatar != ''){
				imgPerfil = data[i].avatar;
			}else{
				imgPerfil = '../../../../../../../static.emol.cl/emol50/img/sin_image_comentarios.png';
			}
			
			var textoComentario = '';
			
			if(data[i].text.length > 200){
				textoComentario = (((data[i].text).revMotions().replace('&nbsp;','')).replace(/(<([^>]+)>)/ig,"")).substring(0,200) + "...";
			}else{
				textoComentario = data[i].text.revMotions().replace('&nbsp;','').replace(/(<([^>]+)>)/ig,"");
			}
			var dislay = '';
			if(i > 4){
				dislay = 'display:none;'
			}
			
			if(getCookie("SSTES") != null && getCookie("SSTES") !='')
			{
				if(getCookie("c_user_f") != undefined && getCookie("c_user_f") !='')
				{
					var arrayF = JSON.parse(unescape(getCookie("c_user_f")));
					if(data[i].creatorId != userId)
					{
						if(!arrayF.includes(data[i].creatorId)){
							html = html + '<div class="dashboard_comment" style="'+ dislay +'"><div class="dashboard_hour_comment"><div class="dashboard_img_wall"><img onclick="loadPerfil('+data[i].creatorId+')" src="'+imgPerfil+'" width="auto" height="auto" class="dashboard_img_follow"></div><div class="seguir_usuario" onclick="CommentsApi.follow('+data[i].creatorId+');changebtn(this);"><i id="icono_follow" class="fa fa-user-plus" aria-hidden="true"></i></div></div><div class="dashboard_comment_cont"><span class="dashboard_accion"><span class="nombreAccion" onclick="loadPerfil('+data[i].creatorId+')">'+data[i].creator+'</span> comentó  en </span><a class="dashboard_link" href="'+data[i].page+'#comment_user_'+data[i].id+'"><div class="dashboard_title">'+data[i].pageTitle+'</div></a><div class="dashboard_text_comment">'+textoComentario+'</div><span class="dashboard_time">'+fecha+'</span><div class="dashboard_soc_status"><div class="dashboard_comments"><span class="dashboard_like_txt">'+data[i].likes+'</span></div></div></div></div>';
							}
					}
				}
			}
			else
			{ //MUESTRA CAJA USUARIO NO LOGUEADO
				html = html + '<div class="dashboard_comment" style="'+ dislay +'"><div class="dashboard_hour_comment"><div class="dashboard_img_wall"><img onclick="loadPerfil('+data[i].creatorId+')" src="'+imgPerfil+'" width="auto" height="auto" class="dashboard_img_follow"></div></div><div class="dashboard_comment_cont"><span class="dashboard_accion"><span class="nombreAccion" onclick="loadPerfil('+data[i].creatorId+')">'+data[i].creator+'</span> comentó  en </span><a class="dashboard_link" href="'+data[i].page+'#comment_user_'+data[i].id+'"><div class="dashboard_title">'+data[i].pageTitle+'</div></a><div class="dashboard_text_comment">'+textoComentario+'</div><span class="dashboard_time">'+fecha+'</span><div class="dashboard_soc_status"><div class="dashboard_comments"><span class="dashboard_like_txt">'+data[i].likes+'</span></div></div></div></div>';			
			}
		}			
		
		html = html + "</div></div>";
		$("#masValoradas").html(html);
		
		$(function($){
            $.fn.itemCycle = function(options){
                var _self = $(this);       
                function nextItem(){
                        var last 	= _self.children('div').last().hide()
						//var _last	= last.detach();                    
                        _self.prepend(last);
						last.show()
						$("#masVal div:nth-child(6)").hide();
						$("#masVal div:nth-child(5)").show();
						_self.children('div').last().hide()
                }                
                _self.mouseover(function() {
                    clearInterval(_self.timer);
                }).mouseout(function() {
                    _self.timer = setInterval(nextItem, options.pause || 5000);
                });                
                _self.trigger('mouseout');
            };
            $('#masVal').itemCycle({pause: 10000});
        });
		
    });
};


function rankingComentarista(seccion){
	var urlMoreFollowers = 'http://cache-comentarios.ecn.cl/Comments/Api?action=rankingFollowers&amp;limit=20';
	var urlMoreLikes = 'http://cache-comentarios.ecn.cl/Comments/Api?action=getMostLikedUsers&site=emol&section=' + seccion;
	var urlMoreComments = 'http://comentarios.emol.com/Comments/Api?action=getUsersWithMoreComments&amp;site=emol';
	var userId = getCookie("c_user_i");	
	
	$.ajax(urlMoreLikes).done(function (res1) {
		if (res1) {			
			var likes = res1;				
			var html1 = '';	
			var countMasLikes = 0;
			
			for (var i = 0; i < likes.length; i++) {
				
				var validado = '';
				var destacado = '';
				
				if(countMasLikes < 3)
				{
					var imgLikes = '';		
					if(typeof(likes[i].urlAvatar) !='undefined')
					{
						imgLikes = likes[i].urlAvatar;
					}
					else
					{
						imgLikes = "../../../../../../../static.emol.cl/emol50/img/sin_image_comentarios.png";
					}
					
					if(likes[i].promoted != false)
					{
						destacado = '<div class="user_comments_dest" original-title="Usuario Destacado"><i class="fa fa-star" aria-hidden="true"></i></div>';
					}
					if(likes[i].validatedRut != false)
					{
						validado = '<span class="user_validate"><i class="fa fa-certificate" aria-hidden="true"></i><i class="fa fa-check" aria-hidden="true"></i></span>';
					}
										
					if(getCookie("SSTES") != null && getCookie("SSTES") !='')
					{
						if(getCookie("c_user_f") != undefined && getCookie("c_user_f") !='')					
						{
							var arrayF = JSON.parse(unescape(getCookie("c_user_f")));							
							if(likes[i].id != userId)
							{
								if(!arrayF.includes(likes[i].id)){				
									html1 = html1 + '<article class="cont_rank_item_soc"><div class="cont_rank_item_soc_img"><a href="https://comentarista.emol.com/'+likes[i].id+'/'+likes[i].nickname.removeAccents().split(' ').join('-')+'.html" target="_blank"><img src="'+imgLikes+'" border="0" /></a></div><h2><a href="https://comentarista.emol.com/'+likes[i].id+'/'+likes[i].nickname.removeAccents().split(' ').join('-')+'.html" target="_blank">'+likes[i].nickname+'<div class="icon_user_status">'+validado+destacado+'</div></a></h2><span id="ranLikeSeguir_'+likes[i].id+'" class="seguir_usuario" onclick="CommentsApi.follow('+likes[i].id+')"><i id="icono_follow" class="fa fa-user-plus" aria-hidden="true"></i><span class="rank_list_txt">Seguir</span></span></article>';
									countMasLikes = countMasLikes + 1;
								}	
							}
						}					
					}
					else
					{ //MUESTRA CAJA USUARIO NO LOGUEADO
						html1 = html1 + '<article class="cont_rank_item_soc"><div class="cont_rank_item_soc_img"><a href="https://comentarista.emol.com/'+likes[i].id+'/'+likes[i].nickname.removeAccents().split(' ').join('-')+'.html" target="_blank"><img src="'+imgLikes+'" border="0" /></a></div><h2><a href="https://comentarista.emol.com/'+likes[i].id+'/'+likes[i].nickname.removeAccents().split(' ').join('-')+'.html" target="_blank">'+likes[i].nickname+'<div class="icon_user_status">'+validado+destacado+'</div></a></h2></article>';
						countMasLikes = countMasLikes + 1;						
					}					
				}
			}			
			$('#contMasLikes').html(html1);			
		}
	});
	$.ajax(urlMoreComments).done(function (res2) {
		if (res2) {			
			var masComent = res2;			
			var html2 = '';		
			var countMasComentarios = 0;
			for (var i = 0; i < masComent.length; i++) {
				var validado = '';
				var destacado = '';
				if(countMasComentarios < 3)
				{
					var imgComent = '';			
					if(typeof(masComent[i].urlAvatar) !='undefined')
					{
						imgComent = masComent[i].urlAvatar;
					}
					else
					{
						imgComent = "../../../../../../../static.emol.cl/emol50/img/sin_image_comentarios.png";
					}
					
					if(masComent[i].promoted != false)
					{
						destacado = '<div class="user_comments_dest" original-title="Usuario Destacado"><i class="fa fa-star" aria-hidden="true"></i></div>';
					}
					if(masComent[i].validatedRut != false)
					{
						validado = '<span class="user_validate"><i class="fa fa-certificate" aria-hidden="true"></i><i class="fa fa-check" aria-hidden="true"></i></span>';
					}
					
					if(getCookie("SSTES") != null && getCookie("SSTES") !='')
					{
						if(getCookie("c_user_f") != undefined && getCookie("c_user_f") !='')					
						{
							var arrayF = JSON.parse(unescape(getCookie("c_user_f")));							
							if(masComent[i].id != userId)
							{
								if(!arrayF.includes(masComent[i].id)){
											html2 = html2 + '<article class="cont_rank_item_soc"><div class="cont_rank_item_soc_img"><a href="https://comentarista.emol.com/'+masComent[i].id+'/'+masComent[i].nickname.removeAccents().split(' ').join('-')+'.html" target="_blank"><img src="'+imgComent+'" border="0" /></a></div><h2><a href="https://comentarista.emol.com/'+masComent[i].id+'/'+masComent[i].nickname.removeAccents().split(' ').join('-')+'.html" target="_blank">'+masComent[i].nickname+'<div class="icon_user_status">'+validado+destacado+'</div></a></h2><span id="ranComenSeguir_'+masComent[i].id+'"  class="seguir_usuario" onclick="CommentsApi.follow('+masComent[i].id+')"><i id="icono_follow" class="fa fa-user-plus" aria-hidden="true"></i><span class="rank_list_txt">Seguir</span></span></article>';
									countMasComentarios = countMasComentarios + 1;
								}							
							}
						}
					}
					else 
					{//MUESTRA CAJA USUARIO NO LOGUEADO
					html2 = html2 + '<article class="cont_rank_item_soc"><div class="cont_rank_item_soc_img"><a href="https://comentarista.emol.com/'+masComent[i].id+'/'+masComent[i].nickname.removeAccents().split(' ').join('-')+'.html" target="_blank"><img src="'+imgComent+'" border="0" /></a></div><h2><a href="https://comentarista.emol.com/'+masComent[i].id+'/'+masComent[i].nickname.removeAccents().split(' ').join('-')+'.html" target="_blank">'+masComent[i].nickname+'<div class="icon_user_status">'+validado+destacado+'</div></a></h2></article>';
					countMasComentarios = countMasComentarios + 1;
	
					}	
				}							
			}
			$('#contMasComentarios').html(html2);			
		}
	});
	$.ajax(urlMoreFollowers).done(function (resSeg) {		
		if (resSeg) {		
		
			var masSeguidores = resSeg;				
			var htmlSeg = '';	
			var countMasSeguidores = 0;				

			var select = Math.floor(Math.random() * masSeguidores.length); //RANDOM LISTA MAS SEGUIDORES
								
			for(var i = 0; i < masSeguidores.length; i++){
				var validado = '';
				var destacado = '';
				if(countMasSeguidores < 3)
				{				
					var rand = masSeguidores[select];
								
					var imgSeg = '';
					if(typeof(rand.urlAvatar) !='undefined')
					{
						imgSeg = rand.urlAvatar;
					}
					else
					{
						imgSeg = "../../../../../../../static.emol.cl/emol50/img/sin_image_comentarios.png";
					}
					
					if(rand.promoted != false)
					{
						destacado = '<div class="user_comments_dest" original-title="Usuario Destacado"><i class="fa fa-star" aria-hidden="true"></i></div>';
					}
					if(rand.validatedRut != false)
					{
						validado = '<span class="user_validate"><i class="fa fa-certificate" aria-hidden="true"></i><i class="fa fa-check" aria-hidden="true"></i></span>';
					}
					
					if(getCookie("SSTES") != null && getCookie("SSTES") !='')
					{
						if(getCookie("c_user_f") != undefined && getCookie("c_user_f") !='')
						{
							var arrayF = JSON.parse(unescape(getCookie("c_user_f")));
							if(rand.id != userId)
							{
								if(!arrayF.includes(rand.id))
								{
									htmlSeg = htmlSeg + '<article class="cont_rank_item_soc"><div class="cont_rank_item_soc_img"><a href="https://comentarista.emol.com/'+rand.id+'/'+rand.nickname.removeAccents().split(' ').join('-')+'.html" target="_blank"><img src="'+imgSeg+'" border="0" /></a></div><h2><a href="https://comentarista.emol.com/'+rand.id+'/'+rand.nickname.removeAccents().split(' ').join('-')+'.html" target="_blank">'+rand.nickname+'<div class="icon_user_status">'+validado+destacado+'</div></a></h2><span id="ranFollowerSeguir_'+rand.id+'" class="seguir_usuario" onclick="CommentsApi.follow('+rand.id+')"><i id="icono_follow" class="fa fa-user-plus" aria-hidden="true"></i><span class="rank_list_txt">Seguir</span></span></article>';
									countMasSeguidores = countMasSeguidores + 1;
								}
							}
						}
					}
					else
					{//MUESTRA CAJA USUARIO NO LOGUEADO
						htmlSeg = htmlSeg + '<article class="cont_rank_item_soc"><div class="cont_rank_item_soc_img"><a href="https://comentarista.emol.com/'+rand.id+'/'+rand.nickname.removeAccents().split(' ').join('-')+'.html" target="_blank"><img src="'+imgSeg+'" border="0" /></a></div><h2><a href="https://comentarista.emol.com/'+rand.id+'/'+rand.nickname.removeAccents().split(' ').join('-')+'.html" target="_blank">'+rand.nickname+'<div class="icon_user_status">'+validado+destacado+'</div></a></h2></article>';
						countMasSeguidores = countMasSeguidores + 1;
					}
					
					select = select+1;

					if(select >= masSeguidores.length)
					{
						select = masSeguidores.length - select;				
					}
				}
			}
						
			$('#contMasSeguidores').html(htmlSeg);			
		}
	});
	
	autoCompleteRanking();
};

function autoCompleteRanking(){
	// $("#buscadorRanking").on('keyup', function (e) {
		// if (e.keyCode == 13) {
			// setTimeout( function(){	redirectUserSearch() }, 800);
		// }
	// });
	$('#buscadorRanking').textcomplete([{
		match: /(\w{3,}(?:\s*\w*)*)$/,
		search: function (term, callback) {
			$.getJSON("http://cache-comentarios.ecn.cl/Comments/Api", { action: "userAutoComplete", pattern: term, site: "emol,emolsocial,emolespeciales,emoltv" })
			.done(function (data) {
				var dataList = [];
				$.each(data, function (i, dtB) {
					dataList.push({ name: dtB.nickname, id: dtB.id, img: (typeof dtB.urlAvatar == "undefined") ? "http://static.emol.cl/emol50/img/sin_image_comentarios.png" : dtB.urlAvatar }); //agregarID
				});
				callback(dataList);
			})
			.fail(function () { callback([]); });
		},
		cache: true,
		template: function (tem) {
			return '<div class="social_mencion_img"><img src="' + tem.img + '"></div><span class="social_mencion_nombre">' + tem.name + '</span>';
		},
		replace: function (mention) {
			var html = mention.name;
			$('#buscadorRanking').attr('data-idUser', mention.id);
			$('#buscadorRanking').attr('data-naUser', mention.name);
			redirectUserSearch();
			return '';
		},
		index: 1
	}], { maxCount: 10, noResultsMessage: '&nbsp; Usuario no encontrado.' });
}

function redirectUserSearch(){
	try{
		var id = $('#buscadorRanking').attr('data-idUser');
		var name = $('#buscadorRanking').attr('data-naUser');
		if(id != "" && typeof id !== 'undefined'){
			window.location.href = "https://comentarista.emol.com/" + id + "/" + name.removeAccents().split(' ').join('-') + ".html";
		}else{
			$('.search_ranking').append( $('<span>').addClass("error_user").html('<i class="fa fa-times" aria-hidden="true"></i>Debes seleccionar un usuario'));
			$('.search_ranking span.error_user').show();
			setTimeout(function(){ $('.search_ranking span').remove() }, 3000);
		}
	}catch(err){}
}

function mensajesTipTools() {
	var cookieLogin = getCookie("SSTES");
    var num = Math.floor(Math.random() * 8) + 1;	
    if ((cookieLogin != null) && (cookieLogin != "")) {			
        switch (num) {			
            case 1:
                $("#iconoTip").addClass("tipsiconosComentarios icon_seguir");
                $("#tituloTip").text("Sigue a otros comentaristas:");
                $("#fraseTip").html("Haz clic en <div class=\"seguir_usuario\"><i id=\"icono_follow\" class=\"fa fa-user-plus\" aria-hidden=\"true\"></i></div> y ent&eacute;rate de la participaci&oacute;n de esos comentaristas en el debate.");
                break;
            case 2:
                $("#iconoTip").addClass("tipsiconosComentarios icon_alertas");
                $("#tituloTip").text("Notifica a otros comentaristas:");
                $("#fraseTip").html("Cuando respondas o menciones a otro comentarista recuerda hacerlo con un <b>@</b> para que sea notificado.");
                break;
            case 3:
                $("#iconoTip").addClass("tipsiconosComentarios icon_comentario_tip");
                $("#tituloTip").text("Conoce el historial de otros comentaristas:");				
                $("#fraseTip").html("Haz clic en el nombre de los comentaristas para acceder a su perfil y ver sus comentarios.");
                break;
            case 4:
                $("#iconoTip").addClass("tipsiconosComentarios icon_seguidores");
                $("#tituloTip").html("Ent&eacute;rate qui&eacute;nes son  tus seguidores:");
                $("#fraseTip").html("Ingresa a tu perfil para saber qu&eacute; usuarios te siguen y qui&eacute;nes interact&uacute;an contigo.");
                break;                
            case 5:
                $("#iconoTip").addClass("tipsiconosComentarios icon_imgPerfil");
                $("#tituloTip").text("Edita tu perfil");
                $("#fraseTip").html("Al hacer clic sobre tu nombre en la caja de comentarios ingresa a tu perfil, cambia tus fotos y modifica tus datos.");
                break;
			case 6:
                $("#iconoTip").addClass("tipsiconosComentarios icon_verificar");
                $("#tituloTip").text("Verifica tu cuenta");
                $("#fraseTip").html('Ingresa a tu perfil y completa tus datos para acceder al espacio "Mi Sitio", donde  podr&aacute;s exponer tus ideas y desarrollar los temas que te interesan.');
                break;
			case 7:
                $("#iconoTip").addClass("tipsiconosComentarios icon_userDestacado");
                $("#tituloTip").text("Comentaristas destacados");
                $("#fraseTip").html('Una <i id=\"icono_follow\" class=\"fa fa-star\" aria-hidden=\"true\"></i> al costado del nombre identifica a los "Comentaristas Destacados", quienes fueron seleccionados debido a su aporte al debate. Si quieres formar parte de este grupo env&iacute;anos un correo a comentaristaemol@emol.com.');
                break;
			default:
                $("#iconoTip").addClass("tipsiconosComentarios icon_seguir");
                $("#tituloTip").text("Sigue a otros comentaristas:");
                $("#fraseTip").html("Haz clic en <div class=\"seguir_usuario\"><i id=\"icono_follow\" class=\"fa fa-user-plus\" aria-hidden=\"true\"></i></div> y ent&eacute;rate de la participaci&oacute;n de esos comentaristas en el debate.");
                break;                
        }
    }
    else {		
        $("#iconoTip").addClass("tipsiconosComentarios icon_comentario_tip");
        $("#tituloTip").text("Comenta esta noticia:");
        $("#fraseTip").html("Inicia sesi&oacute;n para interactuar y debatir sobre los temas noticiosos.");
    }

};

function buscadorAmarillas() {
	var queAmarilla = $('#queAmarilla').val();
	window.location.href = "http://amarillas.emol.com/buscar?q=" + encodeURIComponent(queAmarilla);
};

function DetenerTiempo(tiempo){
	$("body").attr("onload","");
	setTimeout(function(){ 
		CargaFechaModificacionHomePage();
	}, tiempo);
};

function getCookie(c_name){
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
	if (x==c_name)
	{
		return unescape(y);
	}
	}
};

function setCookie(c_name,value,exdays){
	var Sitio = document.location.href;
	var exdate=new Date();
	var path = "http://www.emol.com/";
	var domain = (Sitio.indexOf("emol.com") > -1) ? ".emol.com" : ".emol.cl";
	var c_value = "";
	if(exdays != ""){
		exdate.setDate(exdate.getDate() + exdays);
		c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString()) + ";path=" + path + " ;domain=" + domain;
		document.cookie=c_name + "=" + c_value;
	}else{
		document.cookie=c_name + "=" + escape(value) + ";path=" + path + " ;domain=" + domain;
	}
};

function checkCookie(c_name){
	var i,x,y,ARRcookies=document.cookie.split(";"),tkt=0;
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			tkt = 1;
		}
	}		
	return tkt;
};

function removeCookie(c_name){
	var domain = (document.location.host.indexOf("emol.com") > -1) ? ".emol.com" : ".emol.cl";
	document.cookie = encodeURIComponent(c_name)+'=; path=/; domain=www.emol.com; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	document.cookie = encodeURIComponent(c_name)+'=; path=/; domain='+domain+'; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	document.cookie = encodeURIComponent(c_name)+'=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

function lTrim(sStr){
	while (sStr.charAt(0) == " ")
	sStr = sStr.substr(1, sStr.length - 1);
	return sStr;
};

function rTrim(sStr){
	while (sStr.charAt(sStr.length - 1) == " ")
	sStr = sStr.substr(0, sStr.length - 1);
	return sStr;
};

function allTrim(sStr){
	return rTrim(lTrim(sStr));
};
	
function zoomText(texto){
	var max = 24;
	var min = 11;
	var actual;
	var valor;
	
	if($(".EmolText").css("font-size") == ""){
		$(".EmolText").css("font-size", "12px");
	}
	actual = parseInt($(".EmolText").css("font-size"));
	
	if(texto == "disminuir"){
		valor = actual - 1;
		$(".EmolText").css("font-size", valor+"px");
	}
	else{
		valor = actual + 1;
		$(".EmolText").css("font-size", valor+"px");
	}
};

$(function(){
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
	eventer(messageEvent,function(e) {
		var key = e.message ? "message" : "data";
		var data = e[key];
		if(data === parseInt(data, 10)){
			//console.log("paso");
			DetenerTiempo(data);
		}
	},false);
});

String.prototype.createDate = function(){
	var str = this.toString();
	var dt = new Date();
	dt.setFullYear(str.substring(0,4));
	dt.setMonth(str.substring(5,7)-1);
	dt.setDate(str.substring(8,10));        
	dt.setHours(str.substring(11,13));
	dt.setMinutes(str.substring(14,16));
	return dt;
};

Date.prototype.formatDate = function(){
	var result = '';
	var date = this;
	if(date.getDate() === (new Date()).getDate()){
		result = (date.getHours()).toString().replace(/^(\d)$/, '0$1') + ':' + (date.getMinutes()).toString().replace(/^(\d)$/, '0$1');
	} else {
		result = date.getFullYear() + '-' + (date.getMonth() + 1).toString().replace(/^(\d)$/, '0$1') + '-' + (date.getDate()).toString().replace(/^(\d)$/, '0$1');
	}
	return result;
};

String.prototype.toSlug = function() {
	var str = this;
	str = str.replace(/^\s+|\s+$/g, ''); // trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
	var to   = "aaaaaeeeeeiiiiooooouuuunc------";
	for (var i=0, l=from.length ; i<l ; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-'); // collapse dashes

	return str;
};

String.prototype.removeAccents = function(){
	var strAccents = this;
	strAccents = strAccents.split('');
	var strAccentsOut = new Array();
	var strAccentsLen = strAccents.length;
	var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
	var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
	for (var y = 0; y < strAccentsLen; y++) {
		if (accents.indexOf(strAccents[y]) != -1) {
			strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
		} else
			strAccentsOut[y] = strAccents[y];
	}
	strAccentsOut = strAccentsOut.join('');
	return strAccentsOut;
};

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function getMobileOperatingSystem() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	// Windows Phone debe ir primero porque su UA tambien contiene "Android"
	if (/windows phone/i.test(userAgent)) {
	return "Windows Phone";
	}

	if (/android/i.test(userAgent)) {
	return "Android";
	}

	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
	return "iOS";
	}

	return "desconocido";
};

   /* $(document).ready(function () {

        $('#carro_especiales_emol').Carrusel_Emol({
            animation: "slide",
            itemWidth: 350,
            itemMargin: 10,
            directionNav: false,
            contolNav: false,
            selector: "ul > li",
            controlNav: false,
            move: 4,
            slideshow: false,
            slideshowSpeed: 5000,
            animationLoop: false
        });

        $('.prevSlide').on('click', function () {
            $('#carro_especiales_emol').Carrusel_Emol('prev')
            return false;
        })

        $('.nextSlide').on('click', function () {
            $('#carro_especiales_emol').Carrusel_Emol('next')
            return false;
        })
		

    });*/
