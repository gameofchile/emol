var scrollEfectuado = 0, scrollEfectuadoCer = 0, scrollEfectuadoDos = 0, scrollEfectuadoTre = 0, scrollEfectuadoCua = 0, scrollEfectuadoCin = 0;
$(window).scroll(function(){
	TrackingScrollCargaCajas();
});
function GetScrollPercentCajas(){
	var bottom = $(window).height() + $(window).scrollTop();
	var height = $(document).height();
	return Math.round(100*bottom/height);
};

var SECCION;


function TrackingScrollCargaCajas(){	
	var scrollPercent = GetScrollPercentCajas();
	if(scrollPercent>10 && scrollEfectuadoCer==0){		
		scrollEfectuadoCer=1;
		$.ajax({
		  url: '/_portada/cajasecciones/cajamascomentados.aspx',
		  success: function(data) {
		   $('#MascomentadosCont').html(data); 
		   $(function(){
				var ids = [];
				$('#MascomentadosCont .cont_contador_comentarios').each(function(){
					var id = $(this).attr('data-id');		
					if(typeof id !== 'undefined'){
						ids.push(id);
					}
				});
				var strIds = ids.join(',');
				getCommentsNumbers(strIds);
			});
		  },
		  async: true
		});				
		
	}	
	
	if(scrollPercent>35 && scrollEfectuadoDos==0){
		scrollEfectuadoDos=1;		
		$.ajax({
		  url: '/Detalle/Cajas/cajaMasVistas.aspx',
		  success: function(data) {
		   $('#cajaMasVistas').html(data);
		  },
		  async: true
		});		
	}
	
	if(scrollPercent>45 && scrollEfectuadoTre==0){
		SECCION = idSeccion;
		var PLANTILLA = idPlantilla;
		scrollEfectuadoTre=1;
		if(idPlantilla ==1 && SECCION != 11){
		$.ajax({
		  url: '/_portada/cajasecciones/cajaeconomicosderecha.aspx',
		  success: function(data) {
		   $('#EconomicosCont').html(data); 
		  },
		  async: true
		});	
		}
		$.ajax({
		  url: '/Detalle/Cajas/cajaNoticiasMVS.aspx?idseccion=' + SECCION,
		  success: function(data) {
			  var idSeccion = $(this).attr('IdSeccion');
		   $('#cajaNoticiasMVS').html(data); 
		  },
		  async: true
		});				
		/*$.ajax({
		  url: '/Detalle/Cajas/cajaMejorComentados.aspx?idseccion=' + SECCION,
		  success: function(data) {
			  var idSeccion = $(this).attr('IdSeccion');
		   $('#cajaMejorComentados').html(data); 
		  },
		  async: true
		});	*/	
	}
	
	if(scrollPercent>60 && scrollEfectuadoCua==0){
		scrollEfectuadoCua=1;
		if(idPlantilla ==1 && SECCION != 11){
		$.ajax({
		  url: '/Detalle/Cajas/cajaEmolTV.aspx',
		  success: function(data) {
		   $('#cajaEmolTvCont').html(data);
		  },
		  async: true
		});	
		$.ajax({
		  url: '/Detalle/Cajas/cajaTwitter.aspx',
		  success: function(data) {
		   $('#cajaTwitter').html(data);
		  },
		  async: true
		});		
		}
	}
	
};