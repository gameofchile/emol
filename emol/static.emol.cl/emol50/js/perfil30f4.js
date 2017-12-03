var configPerfil = {
	commentsCount : 0,
	numComment : 2,
};

function loadData(IdUsuario,Id){	
	if(!mobilecheck()){	
		listNewsAjax(QueryElastic(IdUsuario,configPerfil.numComment), function(data){
			if(!($.isEmptyObject(data))){
				Perfil(data,Id,IdUsuario);			
			}
		});
	}
};

function loadPerfil(IdUsuario, idComment){
	try{
		if(typeof idComment !== 'undefined'){
			sessionStorage.setItem(cmtData.page.split('http://www.emol.com/')[8], cmtData.cVermas);
			sessionStorage.setItem(cmtData.page.split('http://www.emol.com/')[8] + 'P', idComment);
		}
	}catch(err){}
	
	$("#dashboard_loading_perfil").toggle();
	listNewsAjax(QueryElastic(IdUsuario,30), function(data){
		if(!($.isEmptyObject(data))){								
			listNewsAjax(QueryCountComments(IdUsuario), function(dataCount){
				if(!($.isEmptyObject(dataCount))){	
					// try{
						// window.history.scrollRestoration = "auto";
						// sessionStorage.setItem(window.location.pathname.split('/')[6], cmtData.cVermas);
					// }catch(e){}
					window.location = 'https://comentarista.emol.com/' + IdUsuario + '/'+ (data.userNickname.replace(/ /g,'-')).removeAccents() + '.html';
				}
			});							
		}
	})
};

function loadPerfilConfig(IdUsuario){
	$("#dashboard_loading_perfil").toggle();	
	if (getCookie("c_user_i") != null) {
		listNewsAjax(QueryElastic(IdUsuario,30), function(data){
			if(!($.isEmptyObject(data))){	
				// try{
					// window.history.scrollRestoration = "auto";
					// sessionStorage.setItem(window.location.pathname.split('/')[6], cmtData.cVermas);
				// }catch(e){}
				window.location = 'https://comentarista.emol.com/' + IdUsuario + '/'+ (data.userNickname.replace(/ /g,'-')).removeAccents() + '.html#EditarPefil';					
			}
		});
	}
};

function listNewsAjax(query, callback) {
	$.getJSON( query, function( data ) {
		if(!($.isEmptyObject(data))){
			callback(data);
			return true;
		}
	});
};

function QueryElastic(IdUsuario, num){
	var query = '//cache-comentarios.ecn.cl/Comments/Api?action=getCommentsFromUser&format=json&order=TIME_DESC&limit='+ num +'&selectedUserId=' + IdUsuario + '&age=400&approvedOnly=true&site=emol';
	return query;
};

function QueryCountComments(IdUsuario){
	var query = '//cache-comentarios.ecn.cl/Comments/Api?action=getCommentsCountFromUser&format=json&selectedUserId=' + IdUsuario;
	return query;
};

function Perfil(data, Id, IdUsuario){	
	var Followers = data.userTotalFollowers;
	var Following = data.userTotalFollowing;
	var commentsCounter = data.commentsCounter;	
	var ubicacionP = "";
	var Valido = data.userValidated;

	var nombreShow = "";
	// Nombre Completo usuario validado
	try
	{		
		if(typeof(data.userFullName != "undefined") && data.userFullName !='')
		{			
			var nombreFull = data.userFullName.split('|');							
			if(nombreFull.length > 1)
			{
				var apellidosV = nombreFull[0];
				var nombresV = nombreFull[1].split(' ');
				nombreShow = nombresV[0] + " " + apellidosV;
			}
			else
			{
				nombreShow = data.userFullName;
			}				
		}
	}
	catch (err) {
		nombreShow = '';
	}
		
	
	$('#perfil_nombre_'+Id).html(data.userNickname + ((data.userPromoted == true)? ' <i class="fa fa-star" aria-hidden="true"></i>' : ''));	
	$('#nombreRealFlotante_'+Id).html('('+nombreShow+')');
	
	if(Valido == true)
	{		
		$('#ticValidadoFlotante_'+Id).css({'display':'inline-block'});		
	}

	try {						
		if (typeof (data.location) != "undefined") {
			var icon = "<i class='fa fa-map-marker' aria-hidden='true'></i>";
			ubicacionP = icon + data.location;
		}
		
		if (typeof (data.countryId) != "undefined") {
			if(data.countryId == "CHL"){
				ubicacionP = ubicacionP + ", " + data.country;
			}							
			countryId = data.countryId;
		}	
		
		$('#perfil_ubicacion_'+Id).html(ubicacionP);		
		
	} catch (err) {
		ubicacionP = '';		
		$('#perfil_ubicacion_'+Id).hide();
	}
	
	data = data.comments;
	
	if(data.length > 0)
	{
		try{
			if(data[0].avatar != undefined &&  data[0].avatar != 'undefined' && data[0].avatar != ''){
				$('#perfil_img_'+Id).html($('<span>').attr('class', 'perfil_img_back').append($('<img>').attr('src',data[0].avatar).attr('width','auto').attr('height','auto')));
			}else{
				$('#perfil_img_'+Id).html($('<img>').attr('src','http://static.emol.cl/emol50/img/sin_image_comentarios.png').attr('width','auto').attr('height','auto'));
			}
		}catch(error){
			$('#perfil_img_'+Id).html($('<img>').attr('src','http://static.emol.cl/emol50/img/sin_image_comentarios.png').attr('width','auto').attr('height','auto'));
		}
	
		var userId = getCookie("c_user_i");	
		$('.perfil_seguir_'+data[0].creatorId).html('');
	
		if(getCookie("c_user_f") != undefined && getCookie("c_user_f") !='')
		{
			var arrayF = JSON.parse(unescape(getCookie("c_user_f")));
			
			if(data[0].creatorId != userId)
			{
				//if(!arrayF.includes(data[0].creatorId)){
				if(jQuery.inArray(data[0].creatorId,arrayF) == -1){
					$('.perfil_seguir_'+data[0].creatorId).addClass('seguir_usuario').attr('onclick','CommentsApi.follow('+ data[0].creatorId +')').append(
					$('<i>').attr('id', 'icono_follow').attr('class', 'fa fa-user-plus').attr('aria-hidden', 'true')
					);
				}else{
					$('.perfil_seguir_'+data[0].creatorId).addClass('seguir_usuario').addClass('no_seguir_usuario').attr('onclick','CommentsApi.unFollow('+ data[0].creatorId +')').append(
					$('<i>').attr('id', 'icono_follow').attr('class', 'fa fa-user-times').attr('aria-hidden', 'true')
					);
				}
			}
			else
			{
				$('.perfil_seguir_'+ userId).html('');
			}
		}
		
	}
	else
	{
		$('.actividades_recientes').hide();
	}
	//if(data.length == 0){ $('.actividades_recientes').hide(); }
	$('#perfil_comentarios_'+Id).html('');
	
	for( i = 0 ; i < data.length; i++ ) {
		var date = new Date(data[i].time);
		var dateNow = new Date();
		var fecha;
		if(parseInt(Id) != parseInt(data[i].id)){
			
			if(((date.getMonth() + 1) == (dateNow.getMonth() + 1))&&(date.getDate()==dateNow.getDate())&&(date.getFullYear()==dateNow.getFullYear())){
				fecha = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) ;
			}else{
				fecha = ('0' + date.getDate()).slice(-2)+ '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +date.getFullYear().toString().substr(-2);
			}
			
			$('#perfil_comentarios_'+Id).append(
			$('<div>').attr('class','perfil_comentarios').append(
			$('<div>').attr('class','perfil_comentario_titulo').append( 
			$('<a>').attr('href',data[i].page).html( data[i].pageTitle )
			),
			$('<div>').attr('class','perfil_comentario_texto').append($('<div>').attr('class','perfil_comentario_fecha').append(fecha),data[i].text.revMotions().substr(0, 200))
			)
			);
		}
		
		if(i > configPerfil.numComment) 
		i =  data.length;
	}	
};

function ContadorSocialFollowers(data){
	var followers = data.length;
	$("#perfil_count_info").append(
	$("<div>").attr('class','count_followers').append($("<p>").append('Followers'),followers)
	);
};

function PerfilFull(data, IdUsuario, commentsCount){
	/*
	if(mobilecheck()){
		$('body').addClass('block_scroll');								
	}*/
	
	$('#CommentsPerfilF').html('');
	var  Followers = data.userTotalFollowers;
	var Following = data.userTotalFollowing;
	var Valido = data.userValidated;	
	$('#perfilfull_contador_comentarios').html('');
	$('#perfilfull_contador_comentarios').append(	
	$('<div>').attr('id', 'tabCommentsF').attr('class', 'dashboard_cell cont_profile_comment tabs dashboard_cell_current').append(
	$('<span>').attr('class', 'dashboard_info_label').append("Comentarios"),
	$('<span>').attr('class', 'dashboard_info_value').append(commentsCount),
	$('<span>').attr('class', 'dashboard_line').append('')
	).attr('href', 'javascript:void(0)').attr('onclick', 'openTab("CommentsPerfilF", "tabCommentsF")'),
	$('<div>').attr('id', 'tabFollowersF').attr('class', 'dashboard_cell cont_profile_followers tabs').append(
	$('<span>').attr('class', 'dashboard_info_label').append("Seguidores"),
	$('<span>').attr('class', 'dashboard_info_value').append(Followers),
	$('<span>').attr('class', 'dashboard_line').append('')
	).attr('href', 'javascript:void(0)').attr('onclick', 'openTab("FollowersPerfilF", "tabFollowersF")'+ ';' + 'CommentsApi.getFollowers('+ IdUsuario +')' ),
	$('<div>').attr('id', 'tabFollowingF').attr('class', 'dashboard_cell cont_profile_following tabs').append(
	$('<span>').attr('class', 'dashboard_info_label').append("Siguiendo"),
	$('<span>').attr('class', 'dashboard_info_value').append(Following),
	$('<span>').attr('class', 'dashboard_line').append('')
	).attr('href', 'javascript:void(0)').attr('onclick', 'openTab("FollowingPerfilF", "tabFollowingF")' + ';' + 'CommentsApi.getFollowing('+ IdUsuario +')')
	
	);
	
	if(Valido == true)
	{		
		$('#ticValidadoPerfil').css({'display':'inline-block'});
	}
	else
	{
		$('#ticValidadoPerfil').css({'display':'none'});										
	}
	
	openTab("CommentsPerfilF", "tabCommentsF");
	
	if(data.userAvatar != undefined &&  data.userAvatar != 'undefined' && data.userAvatar != ''){
		$('#perfil_img').html($('<img>').attr('src',data.userAvatar+'?type=large').attr('width','auto').attr('height','auto'));
	}else{
		$('#perfil_img').html($('<img>').attr('src','http://static.emol.cl/emol50/img/sin_image_comentarios.png').attr('width','auto').attr('height','auto'));
	}
	
	if(typeof(data.userPoster) != 'undefined' && data.userPoster != ''){		
		$('#poster_img').html($('<img>').attr('src',data.userPoster).attr('width','100%').attr('height','100%'));
	}else{		
		$('#poster_img').html($('<img>').attr('src','http://static.emol.cl/emol50/img/banner_emol_social.jpg').attr('width','100%').attr('height','100%'));
	}
	
	try
	{		
		if(typeof(data.userFullName != "undefined") && data.userFullName !='')
		{			
			var nombreFull = data.userFullName.split('|');							
			if(nombreFull.length > 1)
			{
				var apellidosV = nombreFull[0];
				var nombresV = nombreFull[1].split(' ');
				nombreShow = nombresV[0] + " " + apellidosV;
			}
			else
			{
				nombreShow = data.userFullName;
			}				
		}
	}
	catch (err) {
		nombreShow = '';
	}
	
	$('#perfil_nombre').html(data.userNickname);
	$('#nombreReal').html('('+nombreShow+')');
	
	var ubicacionPF = "";
	try {						
		if (typeof (data.location) != "undefined") {
			var icon = "<i class='fa fa-map-marker' aria-hidden='true'></i>";
			ubicacionPF = icon + data.location;
		}
		
		if (typeof (data.countryId) != "undefined") {
			if(data.countryId == "CHL"){
				ubicacionPF = ubicacionPF + ", " + data.country;
			}							
			countryId = data.countryId;
		}	
		
		if(ubicacionPF != ''){
			$('#perfil_ubicacion').html(ubicacionPF);
			$('#perfil_ubicacion').show();			
		}
		else{			
			$('#perfil_ubicacion').hide();
		}		
		
	} catch (err) {
		ubicacionPF = '';
		$('#perfil_ubicacion').hide();
	}	
		
	/*if (commentsCount <= 300){
		$('#perfil_tipo').html('#NuevoComentarista');
	}else{
		if((commentsCount <= 3000 )){
			$('#perfil_tipo').html('#Comentarista');
		}else{
			
			
			$('#perfil_tipo').html('#ComentaristaEmol');
		}
	}*/
		
	if (commentsCount <= 300){
		$('#perfil_tipo').html('#ComentaristaNuevo');
	}else{
		if((commentsCount >= 301 && commentsCount <=800)){
			$('#perfil_tipo').html('#ComentaristaFrecuente');
		}else{	
			if((commentsCount >= 801 && commentsCount <=1300)){
			$('#perfil_tipo').html('#ComentaristaActivo');
			}else{			
				if((commentsCount >= 1301 && commentsCount <=2300 )){
				$('#perfil_tipo').html('#ComentaristaPermanente');
				}else{			
				$('#perfil_tipo').html('#ComentaristaEmol');
				}
			}
		}
	}
	
	data = data.comments;	
	
	if(data.length > 0)
	{	
		if(getCookie("c_user_f") != undefined && getCookie("c_user_f") !='')
		{		
			var arrayF = JSON.parse(unescape(getCookie("c_user_f")));	
			//if(!arrayF.includes(data[0].creatorId)){		
			if(jQuery.inArray(data[0].creatorId,arrayF) == -1){
				$('#perfil_seguir_banner').html('').removeAttr('onclick');	
				$('#perfil_seguir_banner').removeClass('bt_unfollow');	
				$('#perfil_seguir_banner').addClass('seguir_usuario button_follow').attr('onclick','CommentsApi.follow('+ data[0].creatorId +')').append(
				$('<i>').attr('id', 'icono_follow').attr('class', 'fa fa-user-plus').attr('aria-hidden', 'true'),'Seguir');
			}else{
				$('#perfil_seguir_banner').html('').removeAttr('onclick');	
				$('#perfil_seguir_banner').addClass('seguir_usuario button_follow bt_unfollow').attr('onclick','CommentsApi.unFollow('+ data[0].creatorId +')').html('Dejar de Seguir');
			}		
		
		}else{		
			$('#perfil_seguir_banner').html('').removeAttr('onclick');
			$('#perfil_seguir_banner').removeClass('seguir_usuario');
		}
		
	}else
	{
		$('.actividades_recientes').hide();
	}
	
	/*if(data.length == 0){
		$('.actividades_recientes').hide();
	}*/
	
	/* REGION ULTIMOS COMENTARIOS */	
	$('#CommentsPerfilF').append(
		$('<span>').attr('class','dashboard_comment_title').append("Últimos Comentarios"),		
		$('<div>').attr('class','dashboard_comment_list').append()
	);

	ScrollSocEmol('dashboard_comment_list');
	
	for( i = 0 ; i < data.length; i++ ) {  
		var date = new Date(data[i].time);
		var dateNow = new Date();
		var fecha;
		if(((date.getMonth() + 1) == (dateNow.getMonth() + 1))&&(date.getDate()==dateNow.getDate())&&(date.getFullYear()==dateNow.getFullYear())){
			fecha = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) ;
		}else{
			fecha = ('0' + date.getDate()).slice(-2)+ '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +date.getFullYear().toString().substr(-2);
		}
		
		var classVerMas = "dashboard_comment";
		
		if(i > 14)
		{
			classVerMas = "dashboard_comment dashboard_vermas_comment";			
		}
		
		switch(i)
		{
			case 14:				
				$('#CommentsPerfilF .dashboard_comment_list').append(
					$('<div>').attr('class', classVerMas).append(
						$('<div>').attr('class', 'dashboard_hour_comment').append(
						$('<span>').attr('class', 'dashboard_time').append(fecha)
						),
						$('<div>').attr('class', 'dashboard_comment_cont').append(
						$('<a>').attr('class', 'dashboard_link').attr('href', data[i].page + "#comment_user_" + data[i].id).append(
						$('<div>').attr('class', 'dashboard_title').append(data[i].pageTitle),
						$('<div>').attr('class', 'dashboard_text_comment').append(data[i].text.revMotions().substr(0, 200))
						)
						),
						$('<div>').attr('class', 'dashboard_soc_status').append(
						$('<div>').attr('class', 'dashboard_like').append(
						$('<span>').attr('class', 'dashboard_like_txt').append(),
						$('<span>').attr('class', 'dashboard_like_number').append(data[i].likes)
						),
						$('<div>').attr('class', 'dashboard_dislike').append(
						$('<span>').attr('class', 'dashboard_like_txt').append(),
						$('<span>').attr('class', 'dashboard_like_number').append(data[i].dislikes)
						)
						)	
					)
				);
				$('#CommentsPerfilF .dashboard_comment_list').append(
					$('<span>').attr('id','span_comment_vermas').attr('class','dashboard_comment_vermas').attr('onclick','verMas();').append("Ver más comentarios")
				);
				break;
			default:
				$('#CommentsPerfilF .dashboard_comment_list').append(
					$('<div>').attr('class', classVerMas).append(
						$('<div>').attr('class', 'dashboard_hour_comment').append(
						$('<span>').attr('class', 'dashboard_time').append(fecha)
						),
						$('<div>').attr('class', 'dashboard_comment_cont').append(
						$('<a>').attr('class', 'dashboard_link').attr('href', data[i].page + "#comment_user_" + data[i].id).append(
						$('<div>').attr('class', 'dashboard_title').append(data[i].pageTitle),
						$('<div>').attr('class', 'dashboard_text_comment').append(data[i].text.revMotions().substr(0, 200))
						)
						),
						$('<div>').attr('class', 'dashboard_soc_status').append(
						$('<div>').attr('class', 'dashboard_like').append(
						$('<span>').attr('class', 'dashboard_like_txt').append(),
						$('<span>').attr('class', 'dashboard_like_number').append(data[i].likes)
						),
						$('<div>').attr('class', 'dashboard_dislike').append(
						$('<span>').attr('class', 'dashboard_like_txt').append(),
						$('<span>').attr('class', 'dashboard_like_number').append(data[i].dislikes)
						)
						)	
					)					
				);					
			break;
		}			
	}
	
	$('#CommentsPerfilF .dashboard_comment_list').append(
		//$('<div>').attr('id','finalLista').append()
	);					
		
			
	if(data.length > (localStorage.getItem("numComment") * 5)){
		$('#perfil_ver_mas').html('');
		$('#perfil_ver_mas').attr('class','perfil_ver_mas').attr('onclick','comment('+ IdUsuario +')').append('Ver Más');
	}else{
		$('#perfil_ver_mas').html('');
	}
		
	$('#dashboard_banner_img').tipsy({gravity: 'n',fade:'true'});
	$('#dashboard_img').tipsy({gravity: 'n',fade:'true'});
	$('#perfil').show();
	$("#dashboard_loading_perfil").toggle();
	
};

function outData(Id){
	$('#perfil-'+Id).hide();
};

function outDataPerfil(){
	$('body').removeClass('block_scroll');
	$('#perfil').hide();
	$("#dashboard_loading_perfil").hide();
	cleanPFull();	
};

function verMas(){	
	$(".dashboard_vermas_comment").css({'display':'block'});
	$("#span_comment_vermas").hide();
};

function cleanPFull(){
	$('#poster_img').html('');
	$('#poster_img').html('');
	$('#perfil_img').html('');
	$('#perfil_nombre').html('');
	$('#perfil_ubicacion').html('');
	$('#perfil_tipo').html('');
	$('#perfil_contador_comentarios').html('');
	$('#CommentsPerfilF').html('');
	$('#dashboard_comment_followers').html('');
	$('#dashboard_comment_followings').html('');	
};

function comment(IdUsuario){
	var num = parseInt(localStorage.getItem("numComment"));
	localStorage.setItem("numComment", (num + 1));
	var numComment = parseInt(localStorage.getItem("numComment") * 5) + 1;
	listNewsAjax(QueryElastic(IdUsuario,numComment), function(data){
		if(!($.isEmptyObject(data))){
			PerfilFullList(data.comments);
			if((data.comments).length > (localStorage.getItem("numComment") * 5)){
				$('#perfil_ver_mas').html('');
				$('#perfil_ver_mas').attr('class','perfil_ver_mas').attr('onclick','comment('+ IdUsuario +')').append('Ver Más');
			}else{
				$('#perfil_ver_mas').html('');
			}
		}
	});
};

function PerfilFullList(data){
	$('#perfil_comentarios').html('');
	for( i = 0 ; i < data.length-1; i++ ) {
		var date = new Date(data[i].time);
		var dateNow = new Date();
		var fecha;
		if(((date.getMonth() + 1) == (dateNow.getMonth() + 1))&&(date.getDate()==dateNow.getDate())&&(date.getFullYear()==dateNow.getFullYear())){
			fecha = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) ;
		}else{
			fecha = ('0' + date.getDate()).slice(-2)+ '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +date.getFullYear();
		}
		$('#perfil_comentarios').append(
		$('<div>').attr('class','perfil_comentarios').append(
		$('<div>').attr('class','perfil_comentario_titulo').append( 
		$('<a>').attr('href',data[i].page).html( data[i].pageTitle )
		),
		$('<div>').attr('class','perfil_comentario_texto').append($('<div>').attr('class','perfil_comentario_fecha').append(fecha),data[i].text.substr(0, 200),$('<div>').attr('class','perfil_comentario_like').append(data[i].likes),$('<div>').attr('class','perfil_comentario_dislike').append(data[i].dislikes))
		)
		);
	}
};