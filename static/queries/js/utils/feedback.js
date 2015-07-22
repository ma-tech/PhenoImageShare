$(function() {
	$("#feedback-tab").click(function() {
		$("#feedback-form").toggle("slide");
	});

  //initialising crsf token for feedback forms processing
	var csrftoken = $.cookie('csrftoken');
	$.ajaxSetup({
	    beforeSend: function(xhr, settings) {
	           xhr.setRequestHeader("X-CSRFToken", csrftoken);
	   }
	});
	
	$("#feedback-form form").on('submit', function(event) {
		var $form = $(this);
		feedback_request = $.ajax({
			type: $form.attr('method'),
			url: $form.attr('action'),
			data: $form.serialize(),
			dataType:'json',
			/*success: function() {
				$("#feedback-form").toggle("slide").find("textarea").val('');
			}*/
		});
		
		feedback_request.done(function( response ) {
   		 	console.log(response);
			$("#feedback-form").toggle("slide").find("textarea").val('');
			
			var message = response.response.message;
			
 	   		$('div.feedback-warning-message').block({ 
 	   	        message: '<p style="font-size:15px; cursor: default">'+message+ '</p>',
 	   	        fadeIn: 700, 
 	   	        fadeOut: 700, 
 	   	        showOverlay: false, 
 	   	        centerY: false, 
				timeout:   2000,
 	   	        css: { 
 	   	            width: '700px', 
 	   	            top: '10px', 
 	   	            left: '', 
 	   	            right: '10px', 
 	   	            border: 'none', 
 	   	            padding: '5px', 
 	   	            backgroundColor: '#000', 
 	   	            '-webkit-border-radius': '10px', 
 	   	            '-moz-border-radius': '10px', 
 	   	            opacity: .6, 
 	   	            color: '#fff' 
 	   	        } 
 	   	    });  
		   
  		});
		
		feedback_request.fail(function( jqXHR, textStatus ) {
  		  console.log(textStatus );
	  });
	  
		event.preventDefault();
	});
});

