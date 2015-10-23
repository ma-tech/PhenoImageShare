(function(OSD, $) {
	
	if (!$.version || $.version.revision < 1) {
	        throw new Error('Toolbox requires Annotation Tool version 0.0.1+');
	}
	
    OSD.AnnotationTool.prototype.toolbox = function(options) {
	     if (!this.toolboxInstance) {
             options = options || {};
             options.annotationTool = this;
             this.toolboxInstance = new $.Toolbox(options);
         } else {
             //this.toolboxInstance.refresh(options);
			 return this.toolboxInstance;
         }
		 
		 return this.toolboxInstance;
     };
	
	 OSD.AnnotationTool.prototype.getToolbox = function() {
		 return this.toolboxInstance;
	 };
		
  $.Toolbox = function(options) {
    
	options = options || {};
  
  	//shape buttons
    this.rectangle_button = options.rect || "rectangle-button";
	this.point_button = options.point || "point-button";
	this.line_button = options.line || "polyline-button";
	this.free_button = options.free || "free-button";
	this.selected_shape = null;
	
	//action buttons
	this.save_button = options.save || "save-button";
	this.undo_button = options.undo || "undo-button";
	this.redo_button = options.redo || "redo-button";
	this.edit_button = options.edit || "edit-button";
	this.delete_button = options.delete || "delete-button";
	this.pin_button = options.pin || "pin-button";
	this.selected_action = null;
	
	this.shapes = {
		rect: "rectangle", line:"polyline", point:"point", free:"free"
	};
	
	this.actions = {
		save:"save", edit:"edit", delete:"delete", undo:"undo", redo:"redo"
	};
	
	//annotation tool
	this.annotationTool = options.annotationTool;
	
	this.myname = "Toolbox";
	
	//initialise toolbox - setup events, etc.
	this.init();
	this.setupEventHandlers();
	
  };
  
   $.Toolbox.prototype = {
   	
	   init: function(){
		   
		   this.disableButtons();
		   
		   console.log("["+this.myname + "]  Initialisation completed.");
		   return;
	   },
	   
	   disableDrawingMode: function(disable){
		   
		   if (disable){
			   this.disableButtons();
			   jQuery("#"+ this.rectangle_button).attr("disabled","disabled");	
		   }else{
			   	jQuery("#"+ this.rectangle_button).removeAttr("disabled");	
		   	 	jQuery("#"+ this.save_button).removeAttr("disabled");	
				jQuery("#"+ this.delete_button).removeAttr("disabled");		
				
		   }
		   
	   },
	   
	   disableButtons: function(){
		   //disable un-used shape buttons
		   jQuery("#"+ this.point_button).attr("disabled","disabled");
		   jQuery("#"+ this.line_button).attr("disabled","disabled");
		   jQuery("#"+ this.line_button).attr("disabled","disabled");
		   jQuery("#"+ this.free_button).attr("disabled","disabled");
		   
		    //disable un-used action buttons
		   jQuery("#"+ this.save_button).attr("disabled","disabled");
		   jQuery("#"+ this.undo_button).attr("disabled","disabled");
		   jQuery("#"+ this.redo_button).attr("disabled","disabled");
		   jQuery("#"+ this.edit_button).attr("disabled","disabled");
		   jQuery("#"+ this.pin_button).attr("disabled","disabled");
		   jQuery("#"+ this.delete_button).attr("disabled","disabled");
	   },
	   
	   setupEventHandlers: function (){
		   var self = this;
		   
		   //setup handlers for shape buttons
		   jQuery("#"+ this.rectangle_button).on("click", jQuery.proxy(this.bindHandler, this));
		   jQuery("#"+ this.point_button).on("click", jQuery.proxy(this.bindHandler, this));
		   jQuery("#"+ this.line_button).on("click", jQuery.proxy(this.bindHandler, this));
		   jQuery("#"+ this.free_button).on("click", jQuery.proxy(this.bindHandler, this));
			
		    //setup handlers for action buttons
		   jQuery("#"+ this.save_button).on("click", jQuery.proxy(this.saveButtonHandler, this));
		   jQuery("#"+ this.undo_button).on("click", jQuery.proxy(this.undoButtonHandler, this));
		   jQuery("#"+ this.redo_button).on("click", jQuery.proxy(this.redoButtonHandler, this));
		   jQuery("#"+ this.edit_button).on("click", jQuery.proxy(this.editButtonHandler, this));
		   jQuery("#"+ this.delete_button).on("click", jQuery.proxy(this.deleteButtonHandler, this));
		   jQuery("#"+ this.pin_button).on("click", jQuery.proxy(this.pinButtonHandler, this));

	   },
	   
	   bindHandler: function(event) {
		   //extract shape from button id
		   var shape = "";
		   
		   if (event.target.id != undefined && event.target.id != "" )
		   		shape = event.target.id.split("-")[0];
		   else if (event.currentTarget.id != undefined && event.currentTarget.id != "" ){
		   		shape = event.currentTarget.id.split("-")[0];
		   }
		   
		   this.setSelectedShape(shape);
		   
		   this.annotationTool.tearDownCanvasEventtHandlers(this.getSelectedShape());
		   
		   this.annotationTool.setupCanvasEventHandler(this.getSelectedShape());
	   },
	   
	   saveButtonHandler: function(){
		   //this.setSelectedAction(this.action.point);
		   this.annotationTool.saveAnnotations();
	   },
	   
	   editButtonHandler: function(){
		   //call annotation tool function to handle action
	   },
		
	   pinButtonHandler: function(){
		   //call annotaiton function to pin object
		   //TODO: Use lockFunction functiof of Fabirc.Object
	   },
	   
	   //TODO: this handler gets called several times for some reason - perhaps event got fired multiple times. please check.
	   deleteButtonHandler: function(){
		   
		   var active_object = this.annotationTool.getActiveObject();
		   var active_objects = this.annotationTool.getActiveObjects();
		 
		   if (active_object != undefined){
			   this.annotationTool.deleteGraphicalAnnotation(active_object);	   	
		   }else if (active_objects != undefined) {
				this.annotationTool.deleteGraphicalAnnotations(active_objects);
		   }
		   
		  anns = this.annotationTool.getAnnotations();
	   
	   },
	   
	   setSelectedShape: function(shape){
		   this.selected_shape = shape;
	   },
	   
 
	   getSelectedShape: function(){
		   return this.selected_shape;
	   },
	   
	   setSelectedAction: function(action){
		   this.selected_action = action;
	   },
	   	  
	   getSelectedAction: function(){
		   return this.selected_action;
	   },
	   
	   getObjects: function(){
		   return this.canvas.getObjects();
	   },
	   
	   minimise: function() {

	   },
	   
	   maximise: function() {

	   },

	   restore: function() {

	   },
	   
	   destroyToggleButton: function(){
	  	 //destroy this toolbox
	   }
	   
   };
    
}(OpenSeadragon, AnnotationTool));