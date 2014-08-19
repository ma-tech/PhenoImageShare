function DetailedController(){
 	this.associatedROIURL = "";
	this.imageURL = "";
	this.queryString = "";
	this.annotationBaseURL = "";
};

DetailedController.prototype.initialiseElements= function() { 
  $("#annotation_accordion").draggable({
	  drag: function (event, ui) {
		  console.log("[GUI] Dragging drawing tool: "+$("#annotation_accordion"));
	  }
  });
  
  var associatedROIURL = this.associatedROIURL;
  var imageURL = this.imageURL;
  var queryString = this.queryString;
  var annotationBaseURL = this.annotationBaseURL;
  
$("#drawingToolButton").on( "click", function() {
	console.log("[Detailed View Controller] Launching Drawing Tool with parameters: ");
	
	console.log("Associated ROI: "+associatedROIURL);
	console.log("Image URL: "+imageURL);
	console.log("Query String: "+queryString);
	
	DetailedController.openwindow(queryString, imageURL, associatedROIURL, annotationBaseURL);
});


$( "#annotation_accordion" ).on( "position_tool", function() {
	positionTool();
});

};

DetailedController.prototype.positionTool= function() { 
	annotation_accordion.style.left = (annotation_accordion.style.left+1200)+'px'; 
	annotation_accordion.style.top = '-700px'; 
};

DetailedController.prototype.enabledSlider= function() {
	$( "#slider" ).slider({
			change: function( event, ui ) {
				console.log("Size slider changing value to: " + $( "#slider" ).slider( "option", "value" ))
			}
		});
};

DetailedController.prototype.setParams= function(params) {
	this.associatedROIURL = params.associatedROIURL;
	this.imageURL = params.imageURL;
	this.queryString = params.queryString;
	this.annotationBaseURL = params.annotationBaseURL;
}

DetailedController.openwindow= function(query, imageURL, associatedROI, annotationBaseURL) {
 var drawingURL = "?q="+query+"&img="+imageURL;
 var annotationToolURL = annotationBaseURL + drawingURL
 
 var drawingWindow = window.open(annotationToolURL,"_blank","height=1400,width=1800,status=yes, scrollbars=yes,top=500px, left=400px");
 
 //var drawingWindow = window.open("drawing" + "?q="+query+"&img="+imageURL+"&roi_ids="+associatedROI,"_blank","height=1400,width=1800,status=yes, scrollbars=yes,top=500px, left=400px");
 console.log("[Drawing View] Parameters - Image URL:"+imageURL+", Associated ROI:"+associatedROI+", Query:"+query);
};