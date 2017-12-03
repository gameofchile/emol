//*Desarrollo : Leonel Solar
// 25-06-2015
if (typeof console == "undefined") { var console = {log: function() {}}; };
var confNES = {
		clientVal : true,
		contaDor : 1,
		WSclientId : '',
		channel : '/user/',
		contAdv : 0
	};

function ultimosComentarios(data){
	switch(data.type){
		case "COMMENT_LIKED":
		case "FOLLOWED_USER_LIKED":
		case "FOLLOWED_USER_DISLIKED":
		case "COMMENT_DISLIKED":
			activaMensaje( data.followedUserNickname, data.commentCreatorNickname, data.type, data.pageUrl, data.pageTitle, data.followedUserAvatar,data.commentText, data.commentCreatorId, data.followedUserId, data.commentId, data.userId);
			break;
		case "FOLLOWED_USER_COMMENTED":
		case "COMMENT_IN_WALL":
		case "COMMENT_REPLIED":
		case "MENTIONED":
			activaMensaje( data.commentCreatorNickname, data.followedUserNickname, data.type, data.pageUrl, data.pageTitle, data.commentCreatorAvatar,data.commentText, data.commentCreatorId, data.followedUserId, data.commentId, data.userId);
			break;
	}	
	return false;
};

function limitar(){
	var cantidad = $(".gritter-item-wrapper").length;
	var limite  = ($(window).width() > 1560 ) ? 6 : 2 ;
	if(cantidad > limite){
		$(".gritter-item-wrapper:first").remove();
	}
};

function buscaOp(opcion){
	var htmlOp = '';
	switch(opcion){
		case "0":
			//todas
			htmlOp += '<span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="2" checked="checked"> Menciones<br><span>Se te notificará cuando un usuario te mencione en un comentario.</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="1" checked="checked"> Actividades de quienes sigues<br><span>Recibirás una notificación cuando uno de los usuarios que sigues comente o interactúe</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="3" checked="checked"> Mi actividad<br><span>Recibirás una notificación cuando algún usuario interactúe con uno de tus comentarios</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="0" checked="checked"> Todas<br><span>Recibirás una notificación en todos los casos nombrados anteriormente.</span></span>';
			break;
		case "1":
			//personas seguidas
			htmlOp += '<span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="2"> Menciones<br><span>Se te notificará cuando un usuario te mencione en un comentario.</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="1" checked="checked"> Actividades de quienes sigues<br><span>Recibirás una notificación cuando uno de los usuarios que sigues comente o interactúe</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="3"> Mi actividad<br><span>Recibirás una notificación cuando algún usuario interactúe con uno de tus comentarios</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="0"> Todas<br><span>Recibirás una notificación en todos los casos nombrados anteriormente.</span></span>';
			break;
		case "2":
			//Menciones
			htmlOp += '<span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="2" checked="checked"> Menciones<br><span>Se te notificará cuando un usuario te mencione en un comentario.</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="1"> Actividades de quienes sigues<br><span>Recibirás una notificación cuando uno de los usuarios que sigues comente o interactúe</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="3"> Mi actividad<br><span>Recibirás una notificación cuando algún usuario interactúe con uno de tus comentarios</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="0"> Todas<br><span>Recibirás una notificación en todos los casos nombrados anteriormente.</span></span>';
			break;
		case "3":
			// Mis actividades 
			htmlOp += '<span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="2"> Menciones<br><span>Se te notificará cuando un usuario te mencione en un comentario.</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="1"> Actividades de quienes sigues<br><span>Recibirás una notificación cuando uno de los usuarios que sigues comente o interactúe</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="3" checked="checked"> Mi actividad<br><span>Recibirás una notificación cuando algún usuario interactúe con uno de tus comentarios</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="0"> Todas<br><span>Recibirás una notificación en todos los casos nombrados anteriormente.</span></span>';
			break;
		case "4":
			////Menciones y personas seguidas
			htmlOp += '<span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="2" checked="checked"> Menciones<br><span>Se te notificará cuando un usuario te mencione en un comentario.</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="1" checked="checked"> Actividades de quienes sigues<br><span>Recibirás una notificación cuando uno de los usuarios que sigues comente o interactúe</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="3"> Mi actividad<br><span>Recibirás una notificación cuando algún usuario interactúe con uno de tus comentarios</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="0"> Todas<br><span>Recibirás una notificación en todos los casos nombrados anteriormente.</span></span>';
			break;
		case "5":
			// Menciones y Mis actividades
			htmlOp += '<span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="2" checked="checked"> Menciones<br><span>Se te notificará cuando un usuario te mencione en un comentario.</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="1"> Actividades de quienes sigues<br><span>Recibirás una notificación cuando uno de los usuarios que sigues comente o interactúe</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="3" checked="checked"> Mi actividad<br><span>Recibirás una notificación cuando algún usuario interactúe con uno de tus comentarios</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="0"> Todas<br><span>Recibirás una notificación en todos los casos nombrados anteriormente.</span></span>';
			break;
		case "6":
			// personas seguidas y Mis actividades
			htmlOp += '<span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="2"> Menciones<br><span>Se te notificará cuando un usuario te mencione en un comentario.</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="1" checked="checked"> Actividades de quienes sigues<br><span>Recibirás una notificación cuando uno de los usuarios que sigues comente o interactúe</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="3" checked="checked"> Mi actividad<br><span>Recibirás una notificación cuando algún usuario interactúe con uno de tus comentarios</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="0"> Todas<br><span>Recibirás una notificación en todos los casos nombrados anteriormente.</span></span>';
			break;
		default: //0
			htmlOp += '<span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="2" checked="checked"> Menciones<br><span>Se te notificará cuando un usuario te mencione en un comentario.</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="1" checked="checked"> Actividades de quienes sigues<br><span>Recibirás una notificación cuando uno de los usuarios que sigues comente o interactúe</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="3" checked="checked"> Mi actividad<br><span>Recibirás una notificación cuando algún usuario interactúe con uno de tus comentarios</span></span><span><input type="checkbox" onclick="clickOp(this);" name="opciones" value="0" checked="checked"> Todas<br><span>Recibirás una notificación en todos los casos nombrados anteriormente.</span></span>';
			break;
	}
	htmlOp += '<div class="botones_notificacion"><div class="enviar cancelar"><div class="button_edit_profile" href="javascript:void(0)" onclick="openTab(\'Wall\', \'tabWall\');CloseNotification()">Cancelar</div></div><div class="enviar"><div class="button_edit_profile" href="javascript:void(0)" onclick="openTab(\'Wall\', \'tabWall\');CloseNotification()">Guardar</div></div></div>';
	//$("#cajaOpciones").html(htmlOp);
	$("#editarNotificaciones").html(htmlOp);
};

function clickOp(cb) {
	var op = verficaOp();
	op = remueveCheck(cb, op);
	
	if($.inArray("0",op) > -1){
		sessionStorage.setItem("opComment", 0);
	}else if($.inArray("1",op) > -1 && $.inArray("2",op) > -1 && $.inArray("3",op) > -1){ 
		sessionStorage.setItem("opComment", 0);
	}else if($.inArray("1",op) > -1 && $.inArray("2",op) > -1){
		sessionStorage.setItem("opComment", 4);
	}else if($.inArray("1",op) > -1 && $.inArray("2",op) > -1){
		sessionStorage.setItem("opComment", 5);
	}else if($.inArray("1",op) > -1 && op.length == 1){
		sessionStorage.setItem("opComment", 1);
	}else if($.inArray("2",op) > -1 && op.length == 1){
		sessionStorage.setItem("opComment", 2);
	}else if($.inArray("3",op) > -1 && op.length == 1){
		sessionStorage.setItem("opComment", 3);
	}
};

function verficaOp(){
	var val = [];
	$(':checkbox[name="opciones"]:checked').each(function(i){
	  val[i] = $(this).val();
	});
	return val;
};

function remueveCheck(cb, op){
	
	if(!cb.checked && cb.value  != 0){
		op = jQuery.grep(op, function(value) { return value != cb.value; });
		op = jQuery.grep(op, function(value) { return value != "0";	});
	}else if(cb.checked && cb.value  == 0){
		op = ["0","1","2","3"];
	}else{
		if(op.length == 3){
			op.push("0");
		}else if(op.length <= 2){
			op = jQuery.grep(op, function(value) {
				  return value != "0";
				});
		}
	}
	
	if(op.length == 4){
		$(':checkbox[name="opciones"]').each(function(i){
			(!$(this)[0].checked) ? $(this)[0].checked = true : '';
		});
	}else if($.inArray("0",op) == -1 && op.length <= 2){	
		$(':checkbox[name="opciones"]').each(function(i){
			($(this).val() != "0" || $(this).val() == "1" || $(this).val() == "2"|| $(this).val() == "3") ? $(this).attr('checked',true) : $(this).attr('checked',false);
		});	
	}
	
	return verficaOp();
	
};

function validaTipoOpr(opt){
	switch(opt){
		//case "NEW":
		//case "LIKE":
		//case "DISLIKE":
		case "FOLLOWED_USER_LIKED":
		case "FOLLOWED_USER_COMMENTED":
		case "FOLLOWED_USER_DISLIKED":
		case "MENTIONED":
		case "COMMENT_REPLIED":
		case "COMMENT_LIKED":
		case "COMMENT_DISLIKED":
		case "COMMENT_IN_WALL":
			return true;
		default:
			return false;
	}
};

function activaMensaje(nickA,nickC,type,page,pageTitle,avatarA,txt,idC,idA,commentId, idf){
	var tipo = "", titleComp = "", notCompleta = "", txtMensaje = "", hashtag = "comment_user_"+commentId, ndq = "", idq = "", idS = "", pageComplete = "";
	var tuel = (getCookie('c_user_i') == idC) ? 'tu' :  'el';
	var linkNickA = "nn";
	var linkNickC = "nn";
	
	try{
		linkNickA = (nickA.indexOf(' ') >= 0) ? nickA.split(' ').join('-') : nickA;
	}catch(err){}
	
	try{
		linkNickC = (nickC.indexOf(' ') >= 0) ? nickC.split(' ').join('-') : nickC;
	}catch(err){}
	
	switch(type){
		case "FOLLOWED_USER_LIKED":
			if(tuel == 'tu'){
				tipo = 'A <span class="creatorcomment"><a href="https://comentarista.emol.com/'+idA+'/'+linkNickA+'.html">'+nickA+'</a></span> le gustó'+ tuel +' comentario';
			}else{
				tipo = 'A <span class="creatorcomment"><a href="https://comentarista.emol.com/'+idA+'/'+linkNickA+'.html">'+nickA+'</a></span> le gustó '+ tuel +' comentario de <span class="creatorcomment"><a href="https://comentarista.emol.com/'+idC+'/'+linkNickC+'.html">'+ nickC + '</a></span>';
			}
			ndq = nickA;
			idq = idA;
			 // a BF le gusto tu/un comentario
			//txtMensaje = (txt.length > 80) ? txt.revMotionsNoti().substring(6,86) + "..." :  txt.revMotionsNoti().substring(6,txt.length);
			break;
		case "FOLLOWED_USER_DISLIKED":
			if(tuel == 'tu'){
				tipo = 'A <span class="creatorcomment"><a href="https://comentarista.emol.com/'+idA+'/'+linkNickA+'.html">'+ nickA + '</a></span> no le gustó '+ tuel +' comentario';
			}else{
				tipo = 'A <span class="creatorcomment"><a href="https://comentarista.emol.com/'+idA+'/'+linkNickA+'.html">'+ nickA + '</a></span> no le gustó '+ tuel +' comentario de <span class="creatorcomment"><a href="https://comentarista.emol.com/'+idC+'/'+linkNickC+'.html">'+nickC+'</a></span>';
			} 
			ndq = nickC;
			idq = idC;
			// a BF no le gusto tu/un comentario
			//txtMensaje = (txt.length > 80) ? txt.revMotionsNoti().substring(6,86) + "..." :  txt.revMotionsNoti().substring(6,txt.length);
			break;
		case "COMMENT_LIKED":
			tipo = 'A <span class="creatorcomment"><a href="https://comentarista.emol.com/'+idA+'/'+linkNickA+'.html">'+ nickA + '</a></span> le gust&oacute tu comentario'; 
			ndq = nickA;
			idq = idA;
			// a NN le gusto tu comentario
			//txtMensaje = (txt.length > 80) ? txt.revMotionsNoti().substring(6,86) + "..." :  txt.revMotionsNoti().substring(6,txt.length);
			break;
		case "COMMENT_DISLIKED":
			tipo = 'A <span class="creatorcomment"><a href="https://comentarista.emol.com/'+idA+'/'+linkNickA+'.html">'+ nickA + '</a></span> no le gust&oacute tu comentario'; 
			ndq = nickA;
			idq = idA;
			// a NN le gusto tu comentario
			//txtMensaje = (txt.length > 80) ? txt.revMotionsNoti().substring(6,86) + "..." :  txt.revMotionsNoti().substring(6,txt.length);
			break;
		case "FOLLOWED_USER_COMMENTED":
			if(page.includes('comentarista.emol.com')){
				idS = page.split('http://www.emol.com/')[3];
				page = page.replace("http://","https:///");
				pageComplete = (pageTitle.indexOf(' ') >= 0) ? pageTitle.removeAccents().split(' ').join('-') : pageTitle.removeAccents();
				if(idS == idC){
					tipo = '<span class="creatorcomment"><a href="https://comentarista.emol.com/'+idC+'/'+linkNickA+'.html">'+ nickA + '</a></span> realizó una publicación en su <span class="creatorcomment"><a class="linkcuadro" href="//comentarista.emol.com/'+idC+'/'+linkNickA+'.html">muro</a></span>';
				}else{
					tipo = '<span class="creatorcomment"><a href="https://comentarista.emol.com/'+idC+'/'+linkNickA+'.html">'+ nickA + '</a></span> realizó una publicación en el muro de: <span class="creatorcomment"><a class="linkcuadro" href="'+page+'/'+ pageComplete +'.html#'+hashtag+'">' + pageTitle + '</a></span>';
				}
			}else{
				tipo = '<span class="creatorcomment"><a href="https://comentarista.emol.com/'+idC+'/'+linkNickA+'.html">'+ nickA + '</a></span> comentó';
			}
			ndq = nickA;
			idq = idC;
			// BF comento algo en
			//txtMensaje = (txt.length > 80) ? txt.revMotionsNoti().substring(6,86) + "..." :  txt.revMotionsNoti().substring(6,txt.length);
			break;
		case "COMMENT_IN_WALL":
			if(page.includes('comentarista.emol.com')){
				page = page.replace("http://","https:///");
				idS = page.split('http://www.emol.com/')[3];
				pageComplete = (pageTitle.indexOf(' ') >= 0) ? pageTitle.removeAccents().split(' ').join('-') : pageTitle.removeAccents();
				tipo = '<span class="creatorcomment"><a href="https://comentarista.emol.com/'+idC+'/'+linkNickA+'.html">'+ nickA + '</a></span> realizó una publicación en tu <span class="creatorcomment"><a class="linkcuadro" href="https://comentarista.emol.com/'+idS+'/'+pageComplete+'.html">muro</a></span>';
			}			
			ndq = nickA;
			idq = idC;			
			break;
		case "COMMENT_REPLIED":
			tipo = '<span class="creatorcomment"><a href="https://comentarista.emol.com/'+idC+'/'+linkNickA+'.html">'+ nickA + '</a></span> repondío tu comentario';
			ndq = nickA;
			idq = idC;
			// NN a responde tu comentario
			//txtMensaje = (txt.length > 80) ? txt.revMotionsNoti().substring(6,86) + "..." :  txt.revMotionsNoti().substring(6,txt.length);
			break;
		case "MENTIONED":
			tipo = '<span class="creatorcomment"><a href="https://comentarista.emol.com/'+idC+'/'+linkNickA+'.html">'+ nickA + '</a></span> te mencionó en su comentario';
			ndq = nickA;
			idq = idC;
			// NN te menciono en un comentario
			//txtMensaje = '';
			break;
	}
	
	if(tipo != ""){
		notCompleta = (idS == '') ? tipo + ' en: <a class="linkcuadro" href="'+ page +'#'+hashtag+'">' + pageTitle + '</a>' : tipo;
		$.gritter.add({
			title: notCompleta,
			text:  txtMensaje,
			image: (avatarA)?avatarA:"http://static.emol.cl/emol50/img/sin_image_comentarios.png",
			id: idq,
			idf: idf,
			nick: ndq,
			class_name: 'gritter-light',
			sticky: false,
			time: 20000
		});
		limitar();
	}
};

function starWSdet(){
	var iUser = parseInt(getCookie('c_user_i'));
	if(!isNaN(iUser)){
		notificationWS = new WebSocket(_changeMachine());
		notificationWS.onerror = function (err) {
			console.log("Error: ", err);
		};
		notificationWS.onclose = function (evt) {
			var interval = setInterval(function () {
				if (notificationWS.readyState === 3) {
					confNES.clientVal = true;
					confNES.contaDor++;
					starWSdet();
				}
			},1000);
			if (notificationWS.readyState !== 3) {
				clearInterval(interval);
			}
		};
		notificationWS.onopen = function(evt){
			this.send(JSON.stringify({advice: {timeout: 60000, interval: 0}, channel: "/meta/handshake", id: ""+confNES.contaDor+"", minimumVersion: "1.0",			supportedConnectionTypes: ["websocket", "long-polling", "callback-polling"], version: "1.0",}));
			confNES.contaDor++;
			setTimeout(function(){
				notificationWS.send(JSON.stringify({id:""+confNES.contaDor+"",channel:"/meta/connect",connectionType:"websocket",advice:{timeout:0},clientId:confNES.WSclientId}));
				confNES.contAdv++;
			},300);
			setTimeout(function(){
			notificationWS.send(JSON.stringify({id:""+confNES.contaDor+"",channel:"/meta/connect",connectionType:"websocket",clientId:confNES.WSclientId}));
			confNES.contaDor++;
			},1000);
			
		};

		_reconect();
		
		notificationWS.addEventListener('message', function (msg) {
			_suscribe(msg,iUser);		
			try{
				if(typeof JSON.parse(msg.data)[0].successful === 'undefined'){
					ultimosComentarios(jQuery.parseJSON(JSON.parse(msg.data)[0].data.message));
				}
			}catch(e){}
		});	
	}
};

function _suscribe(msg,iUser){	
	if(confNES.clientVal){
		confNES.WSclientId = JSON.parse(msg.data)[0].clientId;
		notificationWS.send(JSON.stringify({ id: ""+confNES.contaDor+"", channel: '/meta/subscribe', subscription: confNES.channel+iUser,clientId: confNES.WSclientId}));
		confNES.contaDor++;
		confNES.clientVal = false;
	}
};

function _reconect(){
	setInterval(function(){
		/*if(confNES.contAdv == 0){
		notificationWS.send(JSON.stringify({id:""+confNES.contaDor+"",channel:"/meta/connect",connectionType:"websocket",advice:{timeout:0},clientId:confNES.WSclientId}));
			confNES.contAdv++;
		}else{*/
		notificationWS.send(JSON.stringify({id:""+confNES.contaDor+"",channel:"/meta/connect",connectionType:"websocket",clientId:confNES.WSclientId}));
		/*}*/
		confNES.contaDor++;
	},60010);
};

function _changeMachine(){
	var numMaq = Math.floor((Math.random() * 4) + 1);	
	switch(numMaq){
		case 1:
			numMaq = numMaq + 1;
			confNES.nmachine = numMaq;
			break;
		case 2:
			numMaq = numMaq + 1;
			confNES.nmachine = numMaq;
			break;
		case 3:
			numMaq = numMaq + 1;
			confNES.nmachine = numMaq;
			break;
		case 4:
			numMaq = 1;
			confNES.nmachine = numMaq;
			break;
		
	}
	//return "ws://cometd"+numMaq+".ecn.cl/emol/cometd";
	return ('https:' == document.location.protocol ? 'wss:' : 'ws:') + "//cometd4.ecn.cl/emol/cometd";
};

String.prototype.revMotionsNoti = function(){
	var str = this.toString();
	var regX = /(@(.*?)\])/gim, qMa;
	while(qMa = regX.exec(str)){
		var tagHtml = qMa[2].split('[');
		//str = str.replace(qMa[0],'<b>'+tagHtml[0]+'</b>');
		str = str.replace(qMa[0],tagHtml[0]);
	}	
	return str;	
};

$(function(){	
	var iUser = parseInt(getCookie('c_user_i'));
	var opComment = sessionStorage.getItem("opComment");
	
	if(!isNaN(iUser)){
		if(mobilecheck()){
			//$('<div id="cajaOpciones"></div>').insertAfter("#page");
		}else{
			//$('body').append('<div id="cajaOpciones" style="position: fixed;"></div>');
			try{
				if(secMer != 'portada'){
					starWSdet();
				}
			}catch(err){}
		}		
		
		if(opComment != null){
			buscaOp(opComment);
		}else{
			sessionStorage.setItem("opComment", 0);
			buscaOp("0");
		}
				
		window.onbeforeunload = function () {
			if(secMer != 'portada'){
				notificationWS.close();
			}			
		};
	}
});