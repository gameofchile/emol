
var COMMENTS_API = "http://comentarios.emol.com/Comments/Api";
var COMMENTS_API_CACHE = "http://cache-comentarios.ecn.cl/Comments/Api";
var MAX_ANSWERS = 1;
var PRIVATE_MODE = false;

$(document).ready(function(){
	document.cookie = encodeURIComponent('emol_polls')+'=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	if (typeof InitEncuesta === "function") { 
		InitEncuesta();
	}
});

function InitEncuesta(){
	if(typeof GlobalHost === 'undefined'){ GlobalHost = 'http://static.emol.cl/emol50'};
	if ($('.encuesta-emol').length > 0) {
			$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', GlobalHost + '/css/encuestas.css') );
	}
	$('.encuesta-emol').each(function(){
		var IdPoll = $(this).attr('data-id');
		var encuesta = $(this);
		if($(this).attr('data-status') != 'ok'){
			$(this).html($('<div>').attr('class','poll-loading').html('Cargando..'));	
			CratePoll(IdPoll);
		}
	});
}

function CratePoll(IdPoll){
	var encuesta = $('.encuesta-emol[data-id="' + IdPoll + '"]');
	if((getCookie('SSTES') != '') && (getCookie('SSTES') != 'undefined')){
		encuesta.attr('data-status','ok');
	}else{
		encuesta.attr('data-status','not-login');	
	}

	$.get(COMMENTS_API_CACHE, {
		async: false,
		action: 'getPoll',
		pollId: IdPoll
	}).done(function (data){
		var obj = jQuery.parseJSON(data);
		MAX_ANSWERS = obj.maxAnswers;
		PRIVATE_MODE = obj.privateMode;
		encuesta.attr('data-private',obj.privateMode);
		encuesta.attr('data-answers',obj.maxAnswers);
		encuesta.html('');
		encuesta.append($('<div>').attr('class','answer-title').html(obj.title));
		
		if(obj.open == false){
			encuesta.append($('<div>').attr('class','poll-end-banner').append($('<span>').attr('class','poll-txt-end').html('Encuesta finalizada'),$('<span>').attr('class','poll-line-end')));
		}
		
		var tableAnswer = $('<table>').attr('style','width: 100%;').attr('class','answer-table answer-table-'+obj.id); 
		
		obj.answers.forEach(function(item){
			var styleImage = '';
			if(item.urlPhoto == ''){
				styleImage = 'img-not';
			}
			
			var trAnswer = $('<tr>').attr('class','tr-poll-'+item.id + ' ' + styleImage);
			trAnswer.append($('<td>').attr('class','td-radio').append($('<input>').attr('id','answer-'+item.id).attr('class','answer-radio-'+IdPoll).attr('related-id',item.relatedPollId).attr('type','checkbox').attr('name','answer-'+IdPoll).attr('value',item.id),$('<label>').attr('for','answer-'+item.id).attr('class','answer-text').html('x')));
			if(item.urlPhoto != ''){
				trAnswer.append($('<td>').attr('class','td-img').append($('<img>').attr('class','answer-img').attr('src',item.urlPhoto)));
			}else{
				trAnswer.append($('<td>').attr('class','td-img-not'));
			}
			trAnswer.append($('<td>').attr('class','td-text').append($('<label>').attr('for','answer-'+item.id).attr('class','answer-text').html(item.answer)));
			tableAnswer.append(trAnswer);
		});
		encuesta.append(tableAnswer);
		
		encuesta.append($('<div>').attr('id','poll-view-text-'+IdPoll).attr('class','poll-view-text-end'));

		if((getCookie('SSTES') != '') && (getCookie('SSTES') != 'undefined')){
			$('#poll-view-text-'+IdPoll).append($('<div>').attr('class','button-save-poll button-save-poll-'+IdPoll).attr('onclick','GetAnswer('+ IdPoll +')').html(' Votar '));
			try{
				FB.XFBML.parse();
			}catch(error){}
		}else{
			$('#poll-view-text-'+IdPoll).append($('<div>').attr('id','poll-view-'+IdPoll).attr('class','poll-view').append($('<div>').attr('class','poll-text-init-cession').html('Debes iniciar sesi&oacute;n para participar.'),$('<div>').attr('onlogin','getFBuserInfo').attr('class','fb-login-button poll-fb-button')));
		}

		var polls = new Array();
		var  cookiePoll =  getCookie('emol_polls');
		if(cookiePoll != undefined){
			cookiePoll = unescape(cookiePoll);
			polls = cookiePoll.split(',');
		}
		if(!obj.open || polls.includes(IdPoll.toString())){
			$('.button-save-poll-'+IdPoll).addClass('poll-button-disabled').html('Ya votaste');	
			$('.button-save-poll-'+IdPoll).removeAttr('onclick');
			if(!($('.encuesta-emol[data-id="' + IdPoll + '"]').attr('data-private') == 'true')){
				GetResult(IdPoll);			
			}else{
				encuesta.addClass('poll-end');			
				$('#poll-view-text-'+IdPoll).append($('<div>').attr('class','poll-text-date-end').append('Los Resultados ser&aacute;n publicados'));
			}
			if(obj.open == false){
				$('.button-save-poll-'+IdPoll).remove();	
			}				
		}
	});
}
		
function GetAnswer(IdPoll){
	if((getCookie('SSTES') != '') && (getCookie('SSTES') != 'undefined')  &&  (getCookie('SSTES') != undefined)){
		var count = 0;
		$('.answer-radio-'+IdPoll+':checkbox:checked').each(function() {
			count = count +1;
		});
		if(count.toString() == $('.encuesta-emol[data-id="' + IdPoll + '"]').attr('data-answers')){
			var Respt = '';
			$('.button-save-poll-'+IdPoll).addClass('poll-button-disabled').html('Ya votaste');	
			$('.answer-radio-'+IdPoll+':checkbox:checked').each(function(index) {
				var  IdAnswer = $(this).val();
				$.get(COMMENTS_API,{
					action: 'answerPoll',
					answerId: IdAnswer,
					emolToken: getCookie('SSTES'),
					
				}).done(function (data) {
					var obj = jQuery.parseJSON(data);
					Respt = obj.status;
					if(obj.status == 'ok'){
						$('.encuesta-emol').each(function() { 
							var dataIdPoll = $(this).attr('data-id');
							if(dataIdPoll == IdPoll){
								$('#status-result-poll-'+IdPoll).html('Gracias Por Votar.');
							}
						});
					}
					//Voto ya registardo
					if( obj.error == 'already voted or invalid poll'){
						$('.encuesta-emol').each(function() { 
							var dataIdPoll = $(this).attr('data-id');
							if(dataIdPoll == IdPoll){
								//$('#poll-view-text-'+IdPoll).append($('<div>').attr('class','poll-text-date-end').append('Los Resultados ser&aacute;n publicados'));
							}
						});
					}

					if((index === (parseInt($('.encuesta-emol[data-id="' + IdPoll + '"]').attr('data-answers')) - 1))){
						if ( ($('.encuesta-emol[data-id="' + IdPoll + '"]').attr('data-private') == 'false')){
							$('.button-save-poll-'+IdPoll).removeAttr('onclick');
							console.log('GetResult If');
							GetResult(IdPoll);
						}else{
							console.log('GetResult Else');
							$('.button-save-poll-'+IdPoll).removeAttr('onclick');
							$('#poll-view-text-'+IdPoll).append($('<div>').attr('class','poll-text-date-end').append('Los Resultados ser&aacute;n publicados.'));
						}
					}
					
					var answer = $('#answer-'+IdAnswer);
					
					
					var IdRelated = answer.attr('related-id');
					if($.isNumeric(IdRelated)){
						var encuesta = $('.encuesta-emol[data-id="' + IdPoll + '"]');
						encuesta.after($('<blockquote>').attr('class','encuesta-emol').attr('data-id',IdRelated));
						CratePoll(IdRelated);
					}
					//
					
				});
			})
			var polls = new Array();
			var  cookiePoll =  getCookie('emol_polls');
			if(cookiePoll != undefined){
				cookiePoll = unescape(cookiePoll);
				polls = cookiePoll.split(',');
			}
			if(!polls.includes(IdPoll.toString())){	
				polls.push(IdPoll);				
			}
			setCookie('emol_polls' ,polls ,'360');	
		}else{
			if($('.encuesta-emol[data-id="' + IdPoll + '"]').attr('data-answers') == '1'){
				alert('Debes seleccionar ' + $('.encuesta-emol[data-id="' + IdPoll + '"]').attr('data-answers') + ' opción.');
			}else{
				alert('Debes seleccionar ' + $('.encuesta-emol[data-id="' + IdPoll + '"]').attr('data-answers') + ' opciones.');
			}
		}
	}else{
		
		$('.encuesta-emol[data-id="' + IdPoll + '"]').attr('data-status','not-login');
		console.log('Init Secion error');
			$('#poll-view-text-'+IdPoll).append($('<div>').attr('id','poll-view-'+IdPoll).attr('class','poll-view').append($('<div>').attr('class','poll-text-init-cession').html('Debes iniciar sesi&oacute;n para participar.'),$('<div>').attr('onlogin','getFBuserInfo').attr('class','fb-login-button poll-fb-button')));
		try{
			FB.XFBML.parse();
		}catch(error){}
		$('.button-save-poll-'+IdPoll).remove();
	}
}

function GetResult(IdPoll){
	//Resultados
	$.get(COMMENTS_API, {
		async: false,
		action: 'getPollResults',
		pollId: IdPoll
	}).done(function (data2) {
		var obj = jQuery.parseJSON(data2);
		var maxVotos = 0;
		obj.forEach(function(entry) {
			maxVotos = maxVotos + entry.votes;
		});
		
		$('#poll-view-text-'+IdPoll).append($('<div>').attr('id','result-poll-value-'+IdPoll).attr('class','result-poll-value').html('Votos totales: ' + maxVotos));
		
		//Poll
		$('.answer-table-'+IdPoll).addClass('answer-finished');
	
		obj.forEach(function(entry) {
			var percentage = 0;
			
			if(maxVotos > 0){
				var percentage = (( 100 * entry.votes)/maxVotos);
			}
			
			$('.td-radio-'+entry.pollAnswer.id).remove();
			$('.tr-poll-'+entry.pollAnswer.id + ' .td-radio').remove()
			$('.tr-poll-'+entry.pollAnswer.id + ' .td-text').remove();
			var margin = "";
			if(percentage < 4){
				margin = "margin-left: 22px;color:#367dcc;";
			}
			var final_decimal = (Math.round(percentage*10)/10);
			$('.tr-poll-'+entry.pollAnswer.id).append($('<table>').attr('style','width: 100%;').append($('<tr>').append($('<td>').attr('class','answer-text-result').append(entry.pollAnswer.answer).append($('<span>').append('Votos:' + entry.votes + ''))),$('<tr>').append($('<td>').attr('class','answer-text-result').append('<div class="grafico"><strong class="barra" style="width: '+ final_decimal +'%;"></strong><div class="porcentaje">'+final_decimal.toString().replace(".", ",") +'%</div></div>'))));
		});	
	});
}
