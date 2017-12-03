function getLoginEmol(){
	if(typeof getCookie("SSTES") != 'undefined' && getCookie("SSTES") != ""){
			cmtData.aprF = true;
			cmtData.accessToken = getCookie("SSTES");
			cmtData.authType = "emol";
			$('#user_info').fadeIn();
			try{
				if(getCookie('c_user_l').toLowerCase() == 'fb'){
					$('.fb-login-button').show();
				}else{
					$('.btn_pram_logout').show();
					$('.fb-login-button').hide();
				}
			}catch(err){
				$('.fb-login-button').show();
				$('.btn_pram_logout').show();
			}
			CommentsApi.userIdComments();
			CommentsApi.updateComments();
			revhideReplyBox();
		
			if(typeof getCookie("emolMod") !== "undefined"){
				if(getCookie("emolMod") == cmtData.accessToken){
					cmtData.isAdmin = (window.location.href.indexOf("ModeracionUsuario.aspx") > -1 )?false : true;
					$('#moderation_link a')
						.attr('href', '/comentarios/moderacion.aspx?page=' + encodeURIComponent(cmtData.page))
						.html('Herramienta de moderaci&oacute;n');
					$('#moderation_link').show();
				}
			}
		}else{
			window.fbAsyncInit = function () {
				FB.init({
					appId: fbAppID,
					//channelURL: 'http://www.emol.com/include/channel.html',
					status: true,
					xfbml: true,
					cookie: false,
					oauth: true,
					version: 'v2.9'
				});
				
				FB.getLoginStatus(getFBuserInfo);
				
				FB.Event.subscribe('auth.logout', function(response){
					logoutEmol();
				});	
			}
					
		}
};

function getFBuserInfo(response) {
	cmtData.aprF = true;
	if (response.status === 'connected') {
		$('.btn_pram_login').hide();
		$('.btn_pram_logout').hide();
		$('#user_info').fadeIn();	
				
			if (response.authResponse) {
				cmtData.accessToken = response.authResponse.accessToken;
				cmtData.authType = 'fb';
				var fbUID = response.authResponse.userID;
				FB.api('/me?fields=id,name,birthday,email,first_name,last_name,gender', function (responseMe) {
					if(typeof responseMe.email == "undefined"){
						solicitaEmail() 
					}
					facebook_name = responseMe.name;
					facebook_id = responseMe.id;
					facebook_email = responseMe.email;
					document.cookie = "name=" + facebook_name;
					document.cookie = "email=" + facebook_email;
					document.cookie = "fbid=" + facebook_id;
					
					if(typeof getCookie("emolMod") !== "undefined"){
						if(getCookie("emolMod") == facebook_id){
							cmtData.isAdmin = (window.location.href.indexOf("ModeracionUsuario.aspx") > -1 )?false : true;
							$('#moderation_link a')
								.attr('href', '/comentarios/moderacion.aspx?page=' + encodeURIComponent(cmtData.page))
								.html('Herramienta de moderaci&oacute;n');
							$('#moderation_link').show();
						}
					}				

					var d = jQuery.param({
						'i':  responseMe.id,
						'e':  responseMe.email || '',
						'n':  responseMe.first_name || '',
						'l':  responseMe.last_name || '',
						's':  responseMe.gender || '',
						'b':  responseMe.birthday || '',
						'at': FB.getAuthResponse()['accessToken']
					});
					newStatus(Base64.encode(d));
					//cmtData.authType = 'FB';
					CommentsApi.userIdComments();
					setTimeout(function(){
						CommentsApi.updateComments();
						revhideReplyBox();
						rankingComentarista(subSecMer);
						masValoradas(subSecMer);
						mensajesTipTools();
					},1500);				
				});
			}
	}else{
		checkLoginPram();
	}
}

function checkLoginPram() {
	$.ajax({
		url: 'http://pram.elmercurio.com/API/User/Status',
		dataType: 'jsonp',		
		jsonp: 'callback',
		jsonpCallback: 'pramCallback',
		data: {
			ApplicationName: 'EMOL'
		}
	}).done(function (res) {
		if (res && res.hasOwnProperty('encryptedData')) {
			$.ajax({
				url: 'http://pram.elmercurio.com/API/User/Get',
				dataType: 'jsonp',
				jsonp: 'callback',
				jsonpCallback: 'pramCallback',
				data: {
					ApplicationName: 'EMOL'
				}
			}).done(function(res){
				cmtData.accessToken = res.encryptedData;
				$.ajax({
					url: 'http://apps.emol.com/reader/emolComments.php',
					data : { data : cmtData.accessToken},
					dataType: 'jsonp'
				}).done(function(data){
					if(data.hasOwnProperty('name')){
						if(data.name.trim() !== ''){
							if(data.id.indexOf('Anonimo_') === -1){
								$('.fb-login-button').hide();
								$('.btn_pram_logout').show();
								facebook_name = data.name;
								$('#user_info').fadeIn();
								
								if(data.isAdmin) {
									cmtData.isAdmin = cmtData.isAdmin = (window.location.href.indexOf("ModeracionUsuario.aspx") > -1 )?false : true;
									$('#moderation_link a')
										.attr('href', '/comentarios/moderacion.aspx?page=' + encodeURIComponent(cmtData.page))
										.text('Herramienta de moderación');
									$('#moderation_link').show();
								}
								cmtData.authType = 'pram';
								CommentsApi.userIdComments();
								CommentsApi.updateComments();
								revhideReplyBox();
							}else{
								CommentsApi.updateComments();
								$('.btn_pram_login').show();
								$('.fb-login-button').show();
								removeCookie('c_user_i');
								removeCookie('c_user_f');
								removeCookie('SSTES');
								hideReplyBox();
							}
						}else{
							CommentsApi.updateComments();
							CommentsApi.userIdComments();
							$('.btn_pram_logout').show();
							$('.fb-login-button').hide();
							setTimeout(function(){
								if($.trim($("#nick_input2").html())==''){
									$(".compPram").show().append("Para comentar debes completar tu perfil ",$("<b>").attr("onclick","loadPerfilConfig(getCookie(\"c_user_i\"));").append("acá"));
									hideReplyBox();
								}else{
									$('#user_info').fadeIn();
								}
							},1000);
						}
					}else {
						CommentsApi.updateComments();
						removeCookie('c_user_i');
						removeCookie('c_user_f');
						removeCookie('SSTES');
						$('.btn_pram_login').show();
						$('.fb-login-button').show();
						hideReplyBox();
					}
				});
			});
		} else {
			CommentsApi.updateComments();
			$('.fb-login-button').show();
			$('.btn_pram_login').show();
			removeCookie('c_user_i');
			removeCookie('c_user_f');
			removeCookie('SSTES');
			$('#img_perfil').attr('src','');
			$('#nick_input2').html('');
			hideReplyBox()
		}
	}).fail(function (err) {
		removeCookie('c_user_i');
		removeCookie('c_user_f');
		removeCookie('SSTES');
		$('#img_perfil').attr('src','');
		$('#nick_input2').html('');
		CommentsApi.updateComments();
		hideReplyBox()
	});
}

function checkHuman(id) {
	var numOne = Math.floor((Math.random() * 10) + 1);
	var numTwo = Math.floor((Math.random() * 10) + 1);
	var operatorRnd = Math.floor((Math.random() * 3));
	var operators = ["+", "-", "x"];
	vex.dialog.open({
		message: "Hola <b>" + facebook_name + "</b> indicanos por qué deseas denunciar este comentario: ",
		input: "<div class=\"cont_inp_motivo\"><input id=\"inpSpam\" type=\"radio\" name=\"reason\" value=\"spam\" checked/><label for=\"inpSpam\">Spam</label><input id=\"inpOffensive\" type=\"radio\" name=\"reason\" value=\"offensive\"/><label for=\"inpOffensive\">Comentario ofensivo</label></div><span class=\"texto_operacion\">Además resuelva esta operación matemática para confirmar que es humano:</span><div class=\"oper_mat\"><div>" + numOne + "</div><div class=\"signo_mate\">" + operators[operatorRnd] + "</div><div>" + numTwo + "</div></div><div class=\"input_resultado_oper\"><input name=\"result\" type=\"text\" value=\"\"/></div>",
		callback: function (value) {
			if (value.hasOwnProperty('result')) {
				if (mathOperation(operatorRnd, numOne, numTwo) == value.result) {
					vex.dialog.alert('Hemos recibido tu denuncia, nuestros moderadores la revisarán. Gracias');
					CommentsApi.reportComment(id);
				} else {
					vex.dialog.open({
						message: "<b>" + facebook_name + "</b> has cometido un error al solucionar la operación matemática, intentalo nuevamente:",
						input: "<div class=\"cont_inp_motivo\"><input id=\"inpSpam\" type=\"radio\" name=\"reason\" value=\"spam\" checked/><label for=\"inpSpam\">Spam</label><input id=\"inpOffensive\" type=\"radio\" name=\"reason\" value=\"offensive\"/><label for=\"inpOffensive\">Comentario ofensivo</label></div><span class=\"texto_operacion\">Además resuelva esta operación matemática para confirmar que es humano:</span><div class=\"oper_mat\"><div>" + numOne + "</div><div class=\"signo_mate\">" + operators[operatorRnd] + "</div><div>" + numTwo + "</div></div><div class=\"input_resultado_oper\"><input name=\"result\" type=\"text\" value=\"\"/></div>",
						callback: function (value) {
							if (value.hasOwnProperty('result')) {
								if (mathOperation(operatorRnd, numOne, numTwo) == value.result) {
									vex.dialog.alert('Hemos recibido tu denuncia, nuestros moderadores revisarán el texto denunciado. ¡Gracias!');
									CommentsApi.reportComment(id);
								} else {
									vex.dialog.alert('Respuesta errónea, tu denuncia no ha sido procesada.');
								}
							}
						},
						buttons: [
							 $.extend({}, vex.dialog.buttons.YES, {
								 text: 'OK'
							 }),
							 $.extend({}, vex.dialog.buttons.NO, {
								 text: 'SALIR'
							 })
						]
					});
				}
			}
		},
		buttons: [
			 $.extend({}, vex.dialog.buttons.YES, {
				 text: 'OK'
			 }),
			 $.extend({}, vex.dialog.buttons.NO, {
				 text: 'SALIR'
			 })
		]
	});
}

function mathOperation(operation, numOne, numTwo) {
	var result;
	switch (operation) {
		case 0:
			result = numOne + numTwo;
			break;
		case 1:
			result = numOne - numTwo;
			break;
		case 2:
			result = numOne * numTwo;
			break;
	}
	return result;
}

function filterComment(id) {
	var comment;
	var button;
	if(typeof blackListWords === 'undefined'){
		CommentsApi.insertComment(id);
		return;
	}
	if(typeof id === 'undefined'){
		comment = Mentions($('#comment_area').html());				
		button = $('#cont_cmt input');
	}
	else{
		comment = Mentions($('#comment_area' + id).html());
		button = $('#cont_cmt_' + id + ' input');
	}
	
	button.attr("onclick", "");
	
	$('input[name^="file"]').each(function () {
		comment += " " + $(this).val();
	});
	
	
	if (comment.trim() !== "") {
		comment = encodeURIComponent(comment);
		var censored = [];
		var length = blackListWords.length;
		for (var i = 0; i < length; i++) {
			if (comment.contains(blackListWords[i])) {
				censored.push(blackListWords[i]);
			}
		}
		if (censored.length > 0) {
			vex.dialog.open({
				message: "<h1>Estimado(a) usuario(a),</h1><p>Tu comentario contiene palabras que consideramos inadecuadas. Puedes editar el texto para cambiarlas, ya que de otra forma el mensaje quedará pendiente para ser revisado antes de su publicación.</p>",
				callback: function (value) {
					if (value) {
						CommentsApi.insertComment(id);						
					}
					enableInsertCommentButton(id);
				},
				buttons: [
					 $.extend({}, vex.dialog.buttons.YES, {
						 text: 'ENVIAR'
					 }),
					 $.extend({}, vex.dialog.buttons.NO, {
						 text: 'EDITAR'
					 })
				]
			});
		} else {
			CommentsApi.insertComment(id);
		}
		$('#fileupload tbody').html("");
	} else {
		vex.dialog.alert("No puede ingresar mensajes vacíos o código HTML");
		enableInsertCommentButton(id);
	}
}

function enableInsertCommentButton(id){
	if (typeof id === 'undefined')
		$('#cont_cmt input').attr("onclick", "filterComment(); return false;");
	else
		$('#cont_cmt_' + id + ' input').attr("onclick", "filterComment(" + id + "); return false;");
}

function showMoreReplies(className, buttonId){
	$('.' +  className).show();
	$('#' + buttonId).hide();
	if(buttonId.indexOf("_pad")){
		$('#cont_comment .hideVerMas .'+className).removeClass('hideVerMas '+className);
	}
}

function setCommentsView(jsonComments) {
	var commentCheck = {
		lastLevel: 0,
		nextLevel: 0,
		hiddenGroupCounter: 0,
		hiddenGroupCounterPad: 0,
		counter: 0,
		counterPad: 0,
		counterPub : 1,
		comentarios : 0,
		cantComntariosP : 0,
		cantComntariosN : 0,
		afterResetComntariosP : 0,
		afterResetComntariosN : 0
		,statusHideActive : false
		,statusValid : true
		,hashtag : false
	};
	
	for(var j= 0; j < jsonComments.comments.length; j++){
		(jsonComments.comments[j].level == 0)?commentCheck.comentarios++:commentCheck.comentarios;
	}
	
	if(jsonComments.comments.length > 0){
		try{
		var listFriend = JSON.parse(unescape(getCookie('c_user_f')));
		}catch(e){}
		for (var i = 0; i < jsonComments.comments.length; i++) {
			//ANULAR CSS y btn VERMAS CUANDO HAY ANCLA
			if(cmtData.urlHash.indexOf('comment_user_') == -1){
				if(jsonComments.comments[i].level != 0){
					if(ValidateStatusCounter(jsonComments.comments[i].status)){
						try{
							commentCheck.nextLevel = jsonComments.comments[i+1].level;
						}catch(err){
							commentCheck.nextLevel = 0;
						}
						switch(jsonComments.comments[i].level){
							case 1:
								commentCheck.counterPad++;
								commentCheck.cantComntariosP++;
								jsonComments.comments[i].hiddenReplyPadClass = "hidden_group_pad_" + commentCheck.hiddenGroupCounterPad;
								if(commentCheck.counterPad > 1){
									jsonComments.comments[i].hideReplyPad = true;
									if(commentCheck.counterPad === 2){
										jsonComments.comments[i].showReplyButtonPad = true;
										jsonComments.comments[i].showReplyButtonPadId = "show_more_replies_btn_pad_" + commentCheck.hiddenGroupCounterPad;
										commentCheck.afterResetComntariosP = i;
										commentCheck.statusHideActive = true;
									}
								}
								break;
							case 2:
								commentCheck.counter++;
								commentCheck.cantComntariosN++;
								jsonComments.comments[i].hiddenReplyClass = "hidden_group_" + commentCheck.hiddenGroupCounter;
								jsonComments.comments[i].hideReply = commentCheck.statusHideActive;
								if(commentCheck.counter > 1 && jsonComments.comments[i].level === 2){
									jsonComments.comments[i].hideReply = true;
									if(commentCheck.counter === 2){
										jsonComments.comments[i].showReplyButton = true;
										jsonComments.comments[i].showReplyButtonId = "show_more_replies_btn_" + commentCheck.hiddenGroupCounter;
										commentCheck.afterResetComntariosN = i;
										jsonComments.comments[i].verMasHide = (commentCheck.statusHideActive)?'hideVerMas hidden_group_pad_' + commentCheck.hiddenGroupCounterPad:'';
									}
									
									if(commentCheck.afterResetComntariosN != 0 && commentCheck.nextLevel != 2){
										commentCheck.cantComntariosN = (commentCheck.statusHideActive)?commentCheck.cantComntariosN:commentCheck.cantComntariosN-1;
										jsonComments.comments[commentCheck.afterResetComntariosN].showReplyCant = "("+(commentCheck.cantComntariosN)+")";
									}							
								}
								if(commentCheck.nextLevel === 0 || commentCheck.nextLevel === 1){
										commentCheck.counter = 0;
										commentCheck.cantComntariosN = 0;
										commentCheck.hiddenGroupCounter++;
									}
								break;
						}						
					}
				}else{
					if(commentCheck.afterResetComntariosP != 0){
						commentCheck.cantComntariosP = commentCheck.cantComntariosP-1;
						jsonComments.comments[commentCheck.afterResetComntariosP].showReplyPadCant = "("+(commentCheck.cantComntariosP)+")";
						commentCheck.afterResetComntariosP = 0;
					}
					commentCheck.statusHideActive = false;
					commentCheck.counterPad = 0;
					commentCheck.cantComntariosP = 0;
					commentCheck.hiddenGroupCounterPad++;
					commentCheck.counter = 0;
					commentCheck.cantComntariosN = 0;
					commentCheck.hiddenGroupCounter++;
				}
			}else{
				if(cmtData.urlHash != "" && commentCheck.hashtag == false){
					commentCheck.hashtag = true;
					setTimeout(function(){ hashTagAnimateComment(cmtData.urlHash), 1000 });
				}
			}
			try{
			if(listFriend.includes(jsonComments.comments[i].creatorId)){
				jsonComments.comments[i].classValidateFU = 'seguir_usuario no_seguir_usuario';
				jsonComments.comments[i].folowActive = false;
				jsonComments.comments[i].folowActiveCSS = 'times';
			}else{
				if(parseInt(getCookie('c_user_i')) !=  jsonComments.comments[i].creatorId){
				jsonComments.comments[i].classValidateFU = 'seguir_usuario';
				jsonComments.comments[i].folowActive = true;
				jsonComments.comments[i].folowActiveCSS = 'plus';
				}
			}
			}catch(e){}
			
			jsonComments.comments[i].checkValidate = (jsonComments.comments[i].validated)? true : false;
			jsonComments.comments[i].checkpromoted = (jsonComments.comments[i].promotedCreator)? jsonComments.comments[i].promotedCreator : false;
			jsonComments.comments[i].SocialLinkcreatorId = "https://comentarista.emol.com/"+jsonComments.comments[i].creatorId+"/"+jsonComments.comments[i].creator.removeAccents().split(' ').join('-')+".html";
			
			if (cmtData.accessToken != 'undefined') {
				if (jsonComments.comments[i].level < 2) {
					jsonComments.comments[i].showAnswer = (commentCheck.statusValid)? true : false;
				}

				if(jsonComments.comments[i].creatorId === parseInt(getCookie("c_user_i"))){
					jsonComments.comments[i].showDelete = true;
				}
			}
			if (jsonComments.comments[i].status === 'PENDING' || jsonComments.comments[i].status === 'NEW' || jsonComments.comments[i].status === 'REJECTED' || jsonComments.comments[i].status === 'DENOUNCED') {
				jsonComments.comments[i].showApprove = true;
			}
			if (jsonComments.comments[i].boost === 0 && jsonComments.comments[i].level === 0) {
				jsonComments.comments[i].showBoost = true;
			} else if(jsonComments.comments[i].boost === 1){
				jsonComments.comments[i].showUnboost = true;
			}
			if (cmtData.isAdmin) {
				jsonComments.comments[i].isAdmin = true;
				jsonComments.comments[i].statusString = setCommentStatus(jsonComments.comments[i].status, jsonComments.comments[i].denounces, jsonComments.comments[i].boost);
				if(jsonComments.comments[i].authSource === 'pram'){
					jsonComments.comments[i].isPram = true;
				}
			}
			if(mobilecheck() && jsonComments.comments[i].text.length > 200){
				jsonComments.comments[i].showMoreText = true;
			}
			if (jsonComments.comments[i].status === 'PENDING' || jsonComments.comments[i].status === 'REJECTED') {
				jsonComments.comments[i].text = jsonComments.comments[i].text.filterCommentText().revMotions(jsonComments.comments[i].id).replace('&nbsp;','');
			} else {
				jsonComments.comments[i].text = jsonComments.comments[i].text.linkify().revMotions(jsonComments.comments[i].id).replace('&nbsp;','');
			}			
			if(!jsonComments.comments[i].hasOwnProperty('avatar')){
				jsonComments.comments[i].avatar = "http://static.emol.cl/emol50/img/sin_image_comentarios.png";
			}
		
			var tempDate = new Date(jsonComments.comments[i].time);
			jsonComments.comments[i].time = tempDate.dateDiff(jsonComments.time);
			jsonComments.comments[i].index = i + 1;
			if (jsonComments.comments[i].status === 'DELETED' || jsonComments.comments[i].status === 'REJECTED' || jsonComments.comments[i].status === 'PENDING') {
				if (!cmtData.isAdmin) {
					jsonComments.comments.splice(i, 1);
					i--;
				}
			} else {
				if (cmtData.isAdmin || jsonComments.comments[i].creator === facebook_name) {
					jsonComments.comments[i].showDeny = true;
				}
			}
			
			var cantComments = commentCheck.comentarios.toString();
			cantComments = cantComments.substring(0, ((cantComments).length-1)) ;
			cantComments = (parseInt(cantComments)*10);
			cantComments = (cantComments == 20)?10:(cantComments == 10)?cantComments:cantComments-10;
			
			if(jsonComments.comments[i].level == 0){
				if( commentCheck.counterPub % cantComments == 0){
					if(commentCheck.counterPub == cantComments){
						commentCheck.counterPub++
						jsonComments.comments[i].banner = true;
						jsonComments.comments[i].bannerId = (mobilecheck())?376:349;
					}else{
						jsonComments.comments[i].banner = false;
					}
				}else{
					commentCheck.counterPub++;
					jsonComments.comments[i].banner = false;
				}
			}else{
				jsonComments.comments[i].banner = false;
			}			
		}
		
		try{
			//ultimo nodo hijo
			if(commentCheck.afterResetComntariosP != 0){
				commentCheck.cantComntariosP = commentCheck.cantComntariosP-1;
				jsonComments.comments[commentCheck.afterResetComntariosP].showReplyPadCant = "("+(commentCheck.cantComntariosP)+")";
				commentCheck.afterResetComntariosP = 0;
			}
		}catch(err){}
		
		var template = $('#template').html();
		Mustache.parse(template);
		var rendered = Mustache.render(template, jsonComments);
		$('#cont_comment').html(rendered);
		var remainingCmts = jsonComments.commentsCounter - cmtData.size;

		var showMoreBtn = $('#show_more_btn');
		if (remainingCmts > 10) {
			showMoreBtn.show();
			showMoreBtn.html('Cargar 10 Comentarios más');
		} else if (remainingCmts > 0) {
			showMoreBtn.html('Cargar ' + remainingCmts + ' Comentarios más');
			showMoreBtn.show();
		} else {
			showMoreBtn.hide();
		}
		$('#cont_empty_cmt').hide();
	} else {
		$('#cont_comment').html('');
		$('#cont_empty_cmt').fadeIn();
	}
	setTimeout(function(){
		$('.user_validate').tipsy({ gravity: 'w', fade: 'true' });
		$('.user_comments_dest').tipsy({ gravity: 'w', fade: 'true' });
		$('#cont_carga_emol').hide();
	}, 300);
}

function showFullText(id){
	$('#cmt_txt_' + id).removeClass('cont_leer_mas');
	$('#btn_showfulltext_' + id).hide();
}

function showReply(id) {
	$('#cmt_reply_' + id).toggle();
	CommentsApi.autoComplete(id);
	$('#comment_area'+id).attr("original-title", "¿Sabías que puedes mencionar a otros comentaristas usando el @ antes de su nombre?").tipsy({ gravity: 'sw', fade: 'true'});
	if(cmtData.tym == 'undefined'){
		$('#contcheckTCResp'+id).show();
		$("#buttonPublicarResp"+id).prop('disabled', true);
		$('#checkTerminosCommentResp'+id).change(function() {
			if(this.checked) {
				$("#buttonPublicarResp"+id).prop('disabled', false);
				cmtData.aprtym = true;
			}else{
				$("#buttonPublicarResp"+id).prop('disabled', true);
				cmtData.aprtym = false;
			}
		});
	}
	
}

function showAdminPanel(id) {
	$("#adm_cmt_manager_" + id).slideToggle();
};

function setCommentStatus(str, denounces, boost) {
	if(boost != 1){
		switch (str) {
			case "NEW":
				return "<div class='comentario_nuevo'><i class='fa fa-commenting'></i>Comentario Nuevo</div>";
			case "DELETED":
				return "<div class='comentario_borrado'><i class='fa fa-comment'></i>Comentario borrado</div>";
			case "REJECTED":
				return "<div class='comentario_rechazado'><i class='fa fa-times'></i>Comentario Rechazado</div>";
			case "PENDING":
				return "<div class='comment_pendiente_mod msj_moderado'><i class='fa fa-flag'></i><span class='comment_txt_pendiente_mod'>Comentario Pendiente</span></div>";
			case "APPROVED":
				return "<div class='comentario_aprobado'><i class='fa fa-check'></i>Comentario Aprobado</div>";
			case "DENOUNCED":
				return "<div class='comment_denunciado msj_moderado'><i class='fa fa-exclamation-triangle'></i><span class='comment_txt_denunciado_mod'> " + denounces + " | Comentario Denunciado</span></div>";
			default:
				return "";
		}
	}else{
		return "<div class='has-email btn btn-primary bts_admin btn-primary-dest'><i class='fa fa-star'></i>Comentario Destacado</div>";
	}
};

String.prototype.filterCommentText = function () {
	var comment = this.toString();
	var length = blackListWords.length;
	for (var i = 0; i < length; i++) {
		if (comment.contains(blackListWords[i])) {
			comment = comment.replace(blackListWords[i], '<span class="palabra_no_permitida">' + blackListWords[i] + '</span>');
		}
	}	
	return comment;
};

String.prototype.contains = function (it) {
	return this.toLowerCase().indexOf(it) != -1;
};

String.prototype.linkify = function(){
	var str = this.toString();
	var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9áéíóúÁÉÍÓÚüÜñÑ+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	return str.replace(urlRegex,"<a href='$1' target='_blank'>$1</a>"); 
};

String.prototype.revMotions = function(idCom){
	var str = this.toString();
	var regX = /(@(.*?)\])/gim, qMa;
	while(qMa = regX.exec(str)){
		var tagHtml = qMa[2].split('[');
		//str = str.replace(qMa[0],'<b>'+tagHtml[0]+'</b>');
		str = str.replace(qMa[0],'<a class="social_user_link" href="javascript:loadPerfil('+tagHtml[1]+')">'+tagHtml[0]+'</a>');
	}	
	return str;	
};

Date.prototype.dateDiff = function (currentTime) {
	var diff = currentTime - this.getTime();
	var timeConst = {
		y: 29030400000,
		mo: 2419200000,
		w: 604800000,
		d: 86400000,
		h: 3600000,
		mi: 60000
	};
	var timeNames = {
		y: 'año',
		mo: 'mes',
		w: 'semana',
		d: 'día',
		h: 'hora',
		mi: 'minuto'
	};
	var result = '';
	var timeVarName = '';
	if (diff > timeConst['y']) {
		timeVarName = 'y';
	} else if (diff > timeConst['mo']) {
		timeVarName = 'mo';
	} else if (diff > timeConst['w']) {
		timeVarName = 'w';
	} else if (diff > timeConst['d']) {
		timeVarName = 'd';
	} else if (diff > timeConst['h']) {
		timeVarName = 'h';
	} else {
		timeVarName = 'mi';
	}
	if(Math.floor(diff / timeConst[timeVarName]) > 1){
		if(timeVarName === 'mo'){
			result = 'Hace ' + Math.floor(diff / timeConst[timeVarName]) + ' ' + timeNames[timeVarName] + 'es';	
		}else{
			result = 'Hace ' + Math.floor(diff / timeConst[timeVarName]) + ' ' + timeNames[timeVarName] + 's';
		}
	} else {
		if(timeVarName === 'h' || timeVarName === 'w')
			result = 'Hace una ' + timeNames[timeVarName];
		else
			result = 'Hace un ' + timeNames[timeVarName];
	}
	return result;
};

Element.prototype.hasClass = function (className) {
	return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
};

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function newStatus(d){
	var jsn;
	$.getJSON(       
	"https://apps.emol.com/social/reads/status.php?callback=?", 
	{ d : d},   
	function(jsn){});
};

function solicitaEmail(){
	FB.login( function(response) { }, { scope: 'email', auth_type: 'rerequest' } );
};

function Mentions(dtComment){
	var resdtComment = dtComment;
	var qRegex = /(<mentions (.*?)(\<\/mentions>))/g, qiRegex = /(data-id="(.*?)(\"))/g, qnRegex = /(data-name="(.*?)(\"))/g, qMatch, matches;
	
	while ( qMatch = qRegex.exec(dtComment)){
		var idMention = 0, nameMention = "";
		var tagMention = qMatch[1]; 
		while (matches = qiRegex.exec(tagMention)) {
			idMention = matches[2];   
		}
		while (matches = qnRegex.exec(tagMention)) {
			nameMention = matches[2];   
		}
		resdtComment = resdtComment.replace(tagMention, '@'+nameMention+'['+idMention+']');
	}

	return resdtComment;
};

function ValidateStatusCounter(status){
	switch(status){
		case "REJECTED":
		case "DELETED":
		case "PENDING":
			return false;
		default:
			return true;
	}
};

function hideReplyBox(){
	setTimeout(function(){
	$('#cont_comment').find('.cmtbuttons').each(function(i) {
        var txt = $(this).context.firstElementChild;
		if(txt.innerHTML.indexOf('Responder') > -1){txt.style.display = "none";}
		try{commentCheck.statusValid = false;}catch(e){}
    });
	},1500);
	$('#cont_inf_user').hide();
};

function revhideReplyBox(){
	setTimeout(function(){
	$('#cont_comment').find('.cmtbuttons').each(function(i) {
        var txt = $(this).context.firstElementChild;
		if(txt.innerHTML.indexOf('Responder') > -1){txt.style.display = "block";}
		try{commentCheck.statusValid = true;}catch(e){}
    });
	},1500);
	$('#cont_inf_user').show();
};

function changebtn(e){
	if(e.innerHTML.indexOf('-times')> -1){
		e.innerHTML = e.innerHTML.replace('-times','-plus');
		e.attributes.class.value = "seguir_usuario";
		e.attributes.onclick.value = e.attributes.onclick.textContent.replace('unFolow','follow');
	}else if(e.innerHTML.indexOf('-plus')> -1){
		e.innerHTML = e.innerHTML.replace('-plus','-times');
		e.attributes.class.value = "seguir_usuario no_seguir_usuario";
		e.attributes.onclick.value = e.attributes.onclick.textContent.replace('follow','unFollow');
	}
};

function hashTagAnimateComment(id){
	if ('scrollRestoration' in history) {
		history.scrollRestoration = 'manual';
	}
	var nav =  (id.includes("#"))?$(id):$("#"+id);

	if(mobilecheck()){
		setTimeout(function(){ 
			if(window.location.hash && window.location.hash.indexOf('comment_user_') > -1){
				nav.addClass('comentarioDestacado');
			}else{
				cmtData.urlHash = "";
			}
			$('html,body').animate({scrollTop: nav.offset().top-60},'slow');
		},2500);
	}else{
		setTimeout(function(){ 
			nav.addClass('comentarioDestacado');
			$('html,body').animate({scrollTop: nav.offset().top},'slow');
		},2500);
	}	
	
};

function logoutEmol(link){
	$("#user_info").hide();
	
	removeCookie('c_user_f');
	removeCookie('c_user_i');
	removeCookie('c_user_l');
	removeCookie('SSTES');
	
	$('.btn_pram_login').show();
	$('.btn_pram_logout').hide();
	$('.compPram').hide();
	$('.fb-login-button').show();
	
	CommentsApi.updateComments();
	rankingComentarista(subSecMer); 
	masValoradas(subSecMer); 
	mensajesTipTools();
	
	$('#moderation_link').hide();
	$('.cont_menu_admin').hide();
	
	if(typeof link !== 'undefined'){
		setTimeout('document.location = "' + link.href + '"', 200);
	}
};

function promotedTooltip(e){
	if(mobilecheck()){
		$('.cmtdiv .user_comment_info').remove();
		$(e).parent().parent().parent().append('<div class="user_comment_info"><div class="user_comment_info_tit">Comentarista destacado</div><div class="user_comment_info_txt"><h2>¿Quieres ser parte de este grupo?</h2><p>Si quieres ser un Comentarista Destacado envía un correo con nombre de usuario a <a href="mailto:comentaristaemol@emol.com">comentaristaemol@emol.com</a> para realizar tu solicitud.</p></div><div class="flecha-down"></div><div class="flecha-down2"></div></div>');
		$('.cmtdiv .user_comment_info').delay(3200).fadeOut(300);
		setTimeout(function(){
			$('.cmtdiv .user_comment_info').remove();
		},4000);
	}else{
		$('div.user_comments_dest .user_comment_info').remove();
		$(e).append('<div class="user_comment_info"><div class="user_comment_info_tit">Comentarista destacado</div><div class="user_comment_info_txt"><h2>¿Quieres ser parte de este grupo?</h2><p>Si quieres ser un Comentarista Destacado envía un correo con nombre de usuario a <a href="mailto:comentaristaemol@emol.com">comentaristaemol@emol.com</a> para realizar tu solicitud.</p></div><div class="flecha-down"></div><div class="flecha-down2"></div></div>');
		$('div .'+ e.className + ' .user_comment_info' ).delay(3200).fadeOut(300);
		setTimeout(function(){
			$('div.user_comments_dest .user_comment_info').remove();
		},4000);
	}
}