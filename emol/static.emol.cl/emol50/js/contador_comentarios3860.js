$(function(){
	var ids = [];
	var idsTv = [];
	$('.cont_contador_comentarios').each(function(){
		var id = $(this).attr('data-id');		
		if(typeof id !== 'undefined'){
			if(id.length <= 7){
				ids.push(id);
			}else{
				idsTv.push(id);
			}
		}
	});
	var strIds = ids.join(',');
	var strIdsTv = idsTv.join(',');
	if(strIds != ''){
		getCommentsNumbers(strIds, "emol");
	}
	if(strIdsTv != ''){
		getCommentsNumbers(strIdsTv, "emoltv");
	}
	
});


function getCommentsNumbers(ids, site){
	if(typeof ids !== 'undefined'){
		return $.ajax({
			url: 'http://cache-comentarios.ecn.cl/Comments/Api',
			dataType: 'json',
			data: {
				action: 'getTotalCommentsMulti',
				ids: ids,
				site: (typeof site === 'undefined' || site == '') ? "emol" : site
			}
		})
		.done(drawCommentsNumbers)
		.fail(function(err){
		});
	}	
}

function drawCommentsNumbers(response){
	var result = response.result;
	for(var i = 0; i < result.length; i++){
		var comments = result[i].totalComments;
		switch(comments){
			case 0:
				if (window.location.pathname.indexOf("http://www.emol.com/noticias/") > -1)
				{
					$('div[data-id=' + result[i].id + ']').css('display','block');
					$('div[data-id=' + result[i].id + '] span.num_comentarios')					
				}	
				break;
			case 1:
				$('div[data-id=' + result[i].id + ']').css('display','block');
				$('div[data-id=' + result[i].id + '] span.fb_comments_count')
					.html(comments)
					.addClass("comentario_singular");
					//comentarios nuevos
				$('div[data-id=' + result[i].id + '] span.num_comentarios')
					.html(comments);	
				break;
			default:
				$('div[data-id=' + result[i].id + ']').css('display','block');
				$('div[data-id=' + result[i].id + '] span.num_comentarios')
					.html(comments);	
					//comentarios nuevos
				$('div[data-id=' + result[i].id + '] span.fb_comments_count')
					.html(comments)
					.addClass("comentario_plural");					
				break;
		}
	}
}