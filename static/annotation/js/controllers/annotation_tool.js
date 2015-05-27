function AnnotationTool() {
	this.canvas = null;
	this.myname = "Annotation Tool";
	this.annotationPostURL = "";
	
	console.log("["+this.myname+"] Initialising " + this.myname);
};

/**
 * Register a canvas with this controller.
*/
AnnotationTool.prototype.setCanvas= function(canvas) {
	console.log("[AnnodationTool] Registering Canvass: "+canvas.myname);
	this.canvas = canvas;
};

/**
 * Get the registered canvas.
*/
AnnotationTool.prototype.getCanvas= function() {
	return this.canvas;
};

/**
 * Get name.
*/
AnnotationTool.prototype.setName = function(myame) {
	this.myname = myname;
};

/**
 * Get name.
*/
AnnotationTool.prototype.getName = function() {
	return this.myname;
};

/**
 * Perform draw action for the selected shape.
*/
AnnotationTool.prototype.edit = function(annotation) {
	
};

/**
 * Perform draw action for the selected shape.
*/
AnnotationTool.prototype.setAnnotationAJAXURL = function(url) {
	this.annotationPostURL = url;
};

/**
 * Perform draw action for the selected shape.
*/
AnnotationTool.prototype.addAnnotation = function() {
	console.log("[Annotation Tool] Adding annotation to image.");
	
	var annotation_data ={};
	
	annotation_data.name = $("#ann_name").val(); //get name from appropriate field on modal box.
	annotation_data.description = $("#ann_desc").val(); //get name from appropriate field on modal box.
	annotation_data.freetext = $("#ann_freetext").val(); //get name from appropriate field on modal box.
	
	this.resetFields();
	
	data = JSON.stringify(annotation_data);
	
	var csrftoken = $.cookie('csrftoken');
	
	console.log("[Annodation Tool] Posting stringified data: "+data+", with CSRF token: "+csrftoken);
	
	$.ajaxSetup({
	    beforeSend: function(xhr, settings) {
	           xhr.setRequestHeader("X-CSRFToken", csrftoken);
	   }
	});
	
	$.post(this.annotationPostURL, data, function(response) {
	    // Post data collected from the modal box to server.
		console.log("[Annotation Tool] Response from Server: "+response.message);
	}, 'json');
	
};

AnnotationTool.prototype.resetFields = function() {
	$("#ann_name").val("");
	$("#ann_desc").val("");
	$("#ann_freetext").val("");
};