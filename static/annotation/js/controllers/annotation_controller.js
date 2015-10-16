window.AnnotationTool = window.AnnotationTool || function( options ){
    return new OpenSeadragon.AnnotationTool( options );
};

(function( $ ){
	/**
 		Annotation tool version.
     */
  $.version = {
      versionStr: '0.0.1',
      major: parseInt('0', 10),
      minor: parseInt('0', 10),
      revision: parseInt('1', 10)
  };

}(AnnotationTool));


(function($) {
	
	if (!$.version || $.version.major < 1) {
	        throw new Error('OpenSeadragonScalebar requires OpenSeadragon version 1.0.0+');
	}
	
    $.Viewer.prototype.annotationTool = function(options) {
		
         if (!this.annotationToolInstance) {
             options = options || {};
             options.viewer = this;
             this.annotationToolInstance = new $.AnnotationTool(options);
         } else {
             this.annotationToolInstance.refresh(options);
         }
		 
		 return this.annotationToolInstance;
     };
	
  $.AnnotationTool = function(options) {
    
	options = options || {};
	
	if (!options.viewer) {
      	throw new Error("You must specifier an OSD Viewer.");
    }
  
    this.viewer = options.viewer;
    this.canvasId = options.drawingcanvas || "drawingcanvas";
    this.control_panel = options.panel_control || "panel_control";
    this.metadata_panel = options.metadata || "metadata_panel";
    this.ontologies_panel = options.ontologies || "ontologies_panel";
    this.toolbox_panel =  options.toolbox || "toolbox_panel";
    this.similar_images_panel = options.similar_images || "similar_images";
    this.navigator_panel = options.navigator_panel || "navigator_panel";
	this.annotation_data_store = options.annotation_url || "http://aberlour.hgu.mrc.ac.uk:9090//ISS";
	this.canvas_clicked = false;
	this.toggle_button_clicked = false;
	this.imageURL = options.image_url;
	this.imageId = options.imageId;
	this.rois = options.rois;
	this.imageDimensions = options.dimensions;
	this.currentAnnotationId = null;
	
	if (options.toggler.id != undefined){
		this.toggler = options.toggler.id || "mode-selector";
		this.toggler_state = options.toggler.state;
	}
	else{
		this.toggler = options.toggler || "mode-selector";
		this.toggler_state = true;
	}
	
	this.canvas = "";
	
	this.myname = "Annotation Tool";
	
	this.shapes = {
		rect: "rectangle", line:"polyline", point:"point", free:"free"
	};
	
	this.actions = {
		save:"save", edit:"edit", delete:"delete", undo:"undo", redo:"redo"
	};
	
	this.default_shape = null; //this.shapes.line;
	
	this.selected_shape = null; //this.default_shape;
	
	this.highlighted_shapes = [];
	
	this.graphical_annotations_group = undefined;
	
	this.annotations_map = new Map();
	
	this.lastDrawnObject;
	
	this.init();
	
	this.setupEventHandlers();
	
	this.initialiseTextualAnnotations();
	
	this.x0 = undefined;
	this.x0 = undefined;
	this.roi_height = undefined;
	this.roi_width = undefined;
	this.currentAnnotationId = undefined;
	
  };

  AnnotationTool.setCurrentAnnotationModel = function(x,y,w,h,id){
	  this.x0 = x;
	  this.y0 = y;
	  this.roi_height = h;
	  this.roi_width = w;
	  this.currentAnnotationId = id;
  };
  
  AnnotationTool.getCurrentAnnotationModel = function(){
	  return [this.x0, this.y0, this.roi_width, this.roi_height, this.currentAnnotationId];
  };
  
  AnnotationTool.disableDrawing = function(){
	  //this.tearDownCanvasEventtHandlers();
	  //this.toolbox();
  };
  
  AnnotationTool.enableDrawing = function(){
	 
  };
  
   $.AnnotationTool.prototype = {
   	
	   init: function(){
		  var self = this;
		  var toggler_state = this.toggler_state;
		  
		   //Initialise mode selector: using bootstrap-switch
		   var bootstrapswitch = jQuery('#' + this.toggler).bootstrapSwitch({
			   	size:"small",
			   	handleWidth:30,
			   	onColor: "success",
			   	onText:"View",
			   	offText:"Draw",
				state:toggler_state
		   });
		   
		   //Initialise canvas
		   this.canvas = new fabric.Canvas(this.canvasId);
		 
		   /*fabric.Image.fromURL(this.imageURL, function(oImg) {
		     self.canvas.add(oImg);
		   });
		   */
		   
	   },
	   
	   setupEventHandlers: function (){
		   
		   this.setupCanvasEventHandler(this.default_shape);
		   this.setupTogglerEventHandler();
		   //this.setupPopover();
		   
		   console.log("[" + this.myname + "] Completed setting up events handlers");
	   },
	   
	   setupCanvasEventHandler: function (shape){
		   
	  	   var self = this;

		   if (shape == "rectangle"){
			   this.canvas.on('mouse:down', self.drawRect);
		   }else if (shape == "point"){
		   	 	this.canvas.on('mouse:down', self.drawPoint);
		   }else if (shape == "polyline"){
		   	 	this.canvas.on('mouse:down', self.drawLine);
		   }else if (shape == "free"){
		   	 	this.canvas.on('mouse:down', self.drawFree);
		   } 
	   		
		   //map canvas mouse:up events handler
	       this.canvas.on('mouse:up', self.canvasMouseUpHandler);
		   
		   //map canvas after:render events handler
	       this.canvas.on('after:render', jQuery.proxy(this.afterRender, this));
		   
		   //map canvas objects select event
		   this.canvas.on('object:selected', jQuery.proxy(this.highlightShape, this));
		   
		   //group highlighting of shapes
		   this.canvas.on('selection:created', jQuery.proxy(this.highlightShape, this));
		   
		   //update object if moved
		   this.canvas.on('object:moving', jQuery.proxy(this.updateStatus, this));
		   
		   //remove highlighting from selected shapes
		   this.canvas.on('selection:cleared', self.highlightShape);
		   
		   this.canvas.on('mouse:over', jQuery.proxy(this.mouseOver, this));

		    this.canvas.on('mouse:out', jQuery.proxy(this.mouseOut, this));
		   
		   this.setSelectedShape(shape);
	   },
	   
	   setupTogglerEventHandler: function(){
		   var self  = this;
		   
		   //map toggleButton switchChange events handler
		   jQuery('#' + this.toggler).on('switchChange.bootstrapSwitch', function(){
			   var buttonState = jQuery(this).bootstrapSwitch('state');
  				var alrt = {};
  				alrt.annotationId = "None selected";
				
			   if (buttonState){
				   console.log(self.toolbox().disableDrawingMode(true));
				   self.tearDownCanvasEventtHandlers();
				  	alrt.message =  "Switched to view mode";
					alrt.status = "none";
	   				alrt.time = new Date(Date.now()).toLocaleString();
	   				createAlert(alrt);
					
			   }else{
					console.log(self.toolbox().disableDrawingMode(false));
				  	alrt.message =  "Switched to draw mode";
					alrt.status = "success";
	   				alrt.time = new Date(Date.now()).toLocaleString();
	   				createAlert(alrt);
			   }
		   
		  	   jQuery('#imagepanel').css('z-index', 10);
		  	   jQuery('#drawingpanel').css('z-index', 100);
		   
		   
		   }); //self.toggleButtonSwitchHandler);
		   
	   },
	   
	   tearDownCanvasEventtHandlers: function(){
		   
			this.canvas.off('mouse:down');
			this.canvas.off('mouse:move');
			this.canvas.off('mouse:up');
			
			console.log("[" + this.myname + "] Tearing down events handlers");
			
	   },
	   
	   canvasMouseUpHandler: function(options) {
		   	this.off('mouse:move');
	   },
	   
	   afterRender: function(options) {
		   	//call functions to add drawn objects to annotations map.
		   this.appendGraphicalAnnotationToMap();	
	   },
	   
	   
	   //Selection and highlighting functions
	   setSelectedShape: function(shape){
		   this.selected_shape = shape;
	   },
	   
	   getSelectedShape: function(shape){
		   return this.selected_shape;
	   },
	   
	   highlightShape: function(event){
		   
		   if (event.target != undefined && event.target._objects != undefined){
			   for (var i = 0 ; i < event.target._objects.length ; i++){	
			   		event.target._objects[i].set('borderColor','blue');
			   }
			   //this.highlighted_shapes = options.target._objects;
			   
		   }else if (event.target != undefined){
		   	   //this.highlighted_shapes.push(options.target);
			    event.target.set('borderColor','blue');
		   }
		   
	   },
	   	  
	   getHighlightedShapes: function(){
		   return this.highlighted_shapes;
	   },
	   
	   isCanvasClicked: function(){
		 return this.canvas_clicked;
	   },
	   
	   getCanvas: function(){
		   return this.canvas;
	   },
	   
	   setCanvas: function(canvas){
		   this.canvas = canvas;
	   },
		   
	   setActiveObject: function(object){
		   return this.canvas.setActiveObject(object);
	   },
	   
	   setActiveObjects: function(group){
		   return this.canvas.setActiveGroup(group);
	   },
	   
	   getActiveObject: function(){
		   return this.canvas.getActiveObject();
	   },
	   
	   getActiveObjects: function(){
		   return this.canvas.getActiveGroup();
	   },
	   
	   getObjects: function(){
		   return this.canvas.getObjects();
	   },

	   getLastObjectDrawn: function(){
		   return this.lastDrawnObject;
	   },
	   getCurrentMode: function(){
		   return (jQuery('#drawingpanel').css('z-index') > jQuery('#zoomviewer').css('z-index') ? "draw-mode" : "zoom-mode" );
	   },
		
	   mouseOver: function(event){
		  var ann = this.getAnnotations().get(event.target);
		  
		  console.log(ann.params.get("phisid"));
		  
		  event.target.set('stroke','blue');
		  //event.target.set('strokeDashArray',[5, 5]);
		  
	      this.canvas.renderAll();
	   },
	   
	   mouseOut: function(event){
	      event.target.set('stroke','red');
		  this.canvas.renderAll();
	   },
	   
	   updateStatus: function(event){
		   var annotations = this.getAnnotations();
		   
		   if (event.target._objects != undefined){
			   for (var i = 0 ; i < event.target._objects.length ; i++){	
				   annotations.get(event.target._objects[i]).params.set("status", "changed");
				   annotations.set(event.target._objects[i], annotations.get(event.target._objects[i]));
				  
				  /*
				   console.log(event.target._objects[i].originalTop);
				   console.log(event.target._objects[i].originalLeft);
				   console.log(event.target._objects[i]);
				   event.target.perPixelTargetFind = true;
				   console.log(event.target);
				   annotations.forEach(function(value, key) {
					   console.log(key);
				   
				   }, annotations);
			   
				   if (annotations.has(event.target)){
					   console.log("==in here==");
				   		console.log(event.target);
				   }
				  
				*/
				   
			   }
		   }else{
			   annotations.get(event.target).params.set("status", "changed");
			   annotations.set(event.target,annotations.get(event.target));
			    //console.log(event.target);	   
		   }
	   },
	   
	   //Annotation (graphical and textual) and mapping functions
	   createGraphicalObject: function(annotationJSONbject){
	   	//creates a graphic object and return to client

	   },
	   
	   initialiseTextualAnnotations: function(){
		   this.dpt_anatomyids = undefined;
		   this.dpt_anatomy_terms = undefined;
		
		   this.ge_anatomyids = undefined;
		   this.ge_anatomy_terms = undefined;
		
		   this.abn_anatomyids =  undefined;
		   this.abn_anatomy_terms = undefined;
		
		   this.phenotypeids = undefined;
		   this.phenotype_terms = undefined;
		   
		   //clear phis id
		   this.currentAnnotationId = undefined;
		   
		   //object location on canvas
		   this.roi_width = undefined;
		   this.roi_height = undefined;
		   this.x0 = undefined;
		   this.y0 = undefined;
		   
	   },
	   
	   createGraphicalObjects: function(annotationJSONbjects){

		   var modelsData = [];
		   
		   this.loading_existing_models = true;
		   
	   	//calls createGraphicalObject for each JSON object and return to client
		   if (this.imageDimensions != undefined){
	      	   	console.log("[" + this.myname + "] Image dimension (width, height) = ("+ this.imageDimensions[0] + "," + this.imageDimensions[1] + ")");
		   }
		//console.log(annotationJSONbjects);
		
		if (this.rois != undefined || this.imageDimensions != undefined){
			
	   	   	for(var i = 0; i < this.rois.length; i++){
				
				this.currentAnnotationId = this.rois[i].id;
				this.currentImageId = this.rois[i].associated_image;
				
				this.dpt_anatomyids = this.rois[i].depicted_anatomy_id;
				this.dpt_anatomy_terms = this.rois[i].depicted_anatomy_term;
				
				this.ge_anatomyids = this.rois[i].expressed_in_anatomy_id;
				this.ge_anatomy_terms = this.rois[i].expressed_in_anatomy_term;
				
				this.abn_anatomyids = this.rois[i].abnormality_anatomy_id;
				this.abn_anatomy_terms = this.rois[i].abnormality_anatomy_term;
				
				this.phenotypeids = this.rois[i].phenotype_id;
				this.phenotype_terms = this.rois[i].phenotype_term;
				
	   	   		//this.roi_width = this.imageDimensions[0] * (this.rois[i].x_coordinates[1] / 100) - this.imageDimensions[0] * (this.rois[i].x_coordinates[0] /  100);
		
	   	   		//this.roi_height= this.imageDimensions[1] * (this.rois[i].y_coordinates[1] / 100) - this.imageDimensions[1] * (this.rois[i].y_coordinates[0] / 100);
	   	   		
	   	   		this.x0 = this.rois[i].x_coordinates[0] * this.imageDimensions[0] / 100;
				this.x1 = this.rois[i].x_coordinates[1] * this.imageDimensions[0] / 100;
				this.roi_width = this.x1 - this.x0;
				
	   	   		this.y0 = this.rois[i].y_coordinates[0] * this.imageDimensions[1] / 100; 
				this.y1 = this.rois[i].y_coordinates[1] * this.imageDimensions[1] / 100; 
				this.roi_height = this.y1 - this.y0;
				
	   	   		this.roi_dimension = this.roi_width + " x " + this.roi_height;
	
	   	   		modelsData.push([this.x0, this.y0]);
				
				//console.log([this.x0, this.y0,  this.roi_width, this.roi_height,this.currentAnnotationId, this.currentImageId]);
				AnnotationTool.setCurrentAnnotationModel(this.x0, this.y0, this.roi_width, this.roi_height, this.currentAnnotationId);
				
				this.triggerEvent('canvas','mouse:down');
				this.triggerEvent('canvas','mouse:move');
				this.triggerEvent('canvas','mouse:up');
				
				//console.log([this.x0, this.y0, this.roi_height, this.roi_width, this.currentAnnotationId, this.currentImageId]);
				
				this.initialiseTextualAnnotations();
				
				this.canvas.renderAll();
				
	   	   	}
		}
		
		this.loading_existing_models = false;
		
   	   	return modelsData;
		
	   },
	   
	   appendGraphicalAnnotationToMap: function(){
	   	
		//add created graphical annotaiton to map in memory
		   var objects = this.getObjects();
		 
		   if(objects.length > 0){
			   for (var i = 0 ; i < objects.length ; i++){
				   if(objects[i] != undefined){
					   
					   if(!this.annotations_map.has(objects[i])){
						   var metadata = {};
						   var params = new Map();
						   
						   if(this.loading_existing_models){
							   params.set("status", "unchanged");
							   params.set("new", false);
							   params.set("phisid",this.currentAnnotationId);
							   metadata.params = params;
							   
							   if(this.dpt_anatomyids !=undefined){
		   							dpt_anatomy_anns = new Map();
									
									for (val in this.dpt_anatomyids){
										dpt_anatomy_anns.set(this.dpt_anatomyids[val], this.dpt_anatomy_terms[val]);
									}
									metadata.dpt_anatomy = dpt_anatomy_anns;
									/*
		   							for(var i = 0; i < this.dpt_anatomyids.length; i++){
		   								dpt_anatomy_anns.set(this.dpt_anatomyids[i], this.dpt_anatomy_terms[i]);
									}
									metadata.dpt_anatomy = dpt_anatomy_anns;
									*/
							   }
							   if(this.ge_anatomyids !=undefined){
		   							ge_anatomy_anns = new Map();
									
		   							for(var j = 0; j < this.ge_anatomyids.length; j++){
		   								ge_anatomy_anns.set(this.ge_anatomyids[j], this.ge_anatomy_terms[j]);
		   							}
									metadata.ge_anatomy = ge_anatomy_anns;
							   }
							   
							   if(this.abn_anatomyids !=undefined){
		   							abn_anatomy_anns = new Map();
									
		   							for(var k = 0; k < this.abn_anatomyids.length; k++){
		   								abn_anatomy_anns.set(this.abn_anatomyids[k], this.abn_anatomy_terms[k]);
		   							}
									metadata.abn_anatomy = abn_anatomy_anns;
							   }
							   
						   }else{
							   params.set("status", "changed");
							   params.set("new", true);
							   metadata.params = params;
						   }
						   
						   this.annotations_map.set(objects[i], metadata);
					   }
		   		   }

			   }
		   }
	   },
	   
	   updateGraphicalAnnotationInMap: function(object){
	   	//in-memory update of graphical annotation
	   },
	   
	   deleteGraphicalAnnotationFromMap: function(object){
	   	//in-memory deletion of graphical annotation
		   if(this.annotations_map.has(object)){
				this.annotations_map.delete(object);
		   }
	   },
	   
	   getAnnotations: function(){
		   return this.annotations_map;
	   },
	   
	   appendGraphicalAnnotationToGroup: function(graphicalShape){   
		   if (this.graphical_annotations_group == undefined){
			   this.graphical_annotations_group = new fabric.Group([ graphicalShape ], {
				   left: 150,
				   top: 100,
			   });
		   }else{
			   this.graphical_annotations_group.add(graphicalShape);							  	
		   }
	   
		   return this.graphical_annotations_group;
	   },
	   
	   appendGraphicalAnnotationToCanvas: function(graphicalShape){
		   this.canvas.add(graphicalShape);
	   },
	   
	   deleteGraphicalAnnotation: function(graphicalShape){
		  // this.deleteGraphicalAnnotationFromMap(graphicalShape);
		   this.markGraphicalAnnotationAsDeletedInMap(graphicalShape);
		   return graphicalShape.remove();
	   },
	   
	   markGraphicalAnnotationAsDeletedInMap : function(graphicalShape){
		   var annotations = this.getAnnotations();
		   
		   if (annotations.has(graphicalShape)){
			   //console.log(annotations.size);
			   	var text_annotations = annotations.get(graphicalShape);
				
					if (text_annotations["params"] != undefined){
						text_annotations["params"].set("status", "deleted");
					}else{
						alert("Status Not Set for Object");
					}
		   }
		   
		   return annotations;
	   },
	   
	   deleteGraphicalAnnotations: function(graphicalGroup){
		   
		   for (var i = 0 ; i < graphicalGroup._objects.length ; i++){
			   this.deleteGraphicalAnnotation(graphicalGroup._objects[i]);
		   }
		   this.reRender();
	   },
	   
	   reRender: function(){
		   var self = this;
	
		   //clear canvas and re-render objects found in annotaitons map
		   this.canvas.clear();
		   
		   this.annotations_map.forEach(function(value, key) {
			   if(value["params"].get("status") != "deleted"){
				   	self.canvas.add(key);			   	
			   }
		   }, this.annotations_map);
		   
		   return true;
	   },

	   checkAssociatedTextAnnotations: function(object){
		   //include code to verify if text annotations are associated to object (graphical or textual)
		   return false;
	   },
	   
	   addTextAnnotation: function(graphicalOrTexAnnObject, textAnnObject, type){
		   var annotations = this.getAnnotations();
		   
		   if (annotations.has(graphicalOrTexAnnObject)){
			   //console.log(annotations.size);
			   	var textual_annotations = annotations.get(graphicalOrTexAnnObject);
					if (textual_annotations[type] == undefined){
							textual_annotations[type] = new Map();
							textAnnObject.forEach(function(value, key, textAnnObject){
								textual_annotations[type].set(key, value); 
		   					});

					}else{
						textAnnObject.forEach(function(value, key, map){
							textual_annotations[type].set(key, value);
						});
					}
					textual_annotations.params.set("status", "changed");
					annotations.set(graphicalOrTexAnnObject, textual_annotations);
		   }
		   
		   return annotations;
	   },
	   
	   addTextAnnotations: function(graphicalOrTextAnnObjects, textAnnObjects, type){
		 var self = this;  
		 var annotations = this.getAnnotations();
		   
		 if (graphicalOrTextAnnObjects == undefined){
  			 alert("Please select graphical object(s) to annotate");
  			 return annotations;
  		 }
		 
		   if (graphicalOrTextAnnObjects._objects != undefined){
			   for (var i = 0 ; i < graphicalOrTextAnnObjects._objects.length ; i++){
					annotations = self.addTextAnnotation(graphicalOrTextAnnObjects._objects[i], textAnnObjects, type);
			   }
		   }else{

				annotations = self.addTextAnnotation(graphicalOrTextAnnObjects, textAnnObjects, type);
		   }		
		   
		   return annotations;
		   
		},
	   
	   updateTextAnnotation: function(textAnnObjects, graphicalOrTexAnnObjects){
	   	
	   },
	   
	   updateTextAnnotations: function(textAnnObjects, graphicalOrTexAnnObjects){
	   	
	   },
	   
	   updateTextAnnotations: function(textAnnObject, graphicalOrTexAnnObjects){
	   	
	   },
	   
	   updateTextAnnotations: function(textAnnObjects, graphicalOrTexAnnObjects){
	   	
	   },
	   
	   deleteTextAnnotation: function(textAnnObject, graphicalOrTexAnnObjects){
	   	
	   },
	   
	   deleteTextAnnotations: function(graphicalOrTexAnnObjects, textAnnObjects){
		   if (textAnnObjects == undefined){
		   		//delete all associated annotations
		   }else{
		   	//delete annotation textAnnObjects from annotations associated with graphicalOrTexAnnObjects
		   }
	   },
	   
	   deserialiseAnnotations: function(annotationROIJSON){
	   	
	   },
	   
	   saveAnnotations: function(){
		   var self = this;
		   var version = "100";
		   //var phisid = "roi_ua_testX19776";
		   var creatorid = "solomon";
		   var imageid = this.imageId; //"emage_EMAGE_1218.1";
		   
		   var annotations = this.getAnnotations();
		
			annotations.forEach(function(value, key, annotations){
			
				var freetext_ids = [];
				var freetext_terms = [];
				
				var coordinates_data = self.extract_XYZ(key);
				var data = {};
				
				//set object coordinates
				data.x_value = coordinates_data[0];
				data.y_value = coordinates_data[1];
				data.z_value = coordinates_data[2];
				
				//set static values
				data.version = version;
				//data.phisid = phisid;
				data.creatorid = creatorid;
				data.imageid = imageid;
				
				//set text annotations for depicted anatomy
				if (value['dpt_anatomy'] != undefined){
					var text_data = self.extract_dpt_anatomy_data(value);
					data.dpt_anatomy_term = text_data[1];
					data.dpt_anatomyid = text_data[0];
				}
				
				//set text annotations for gene expression anatomy
				if (value['ge_anatomy'] != undefined){
					var text_data = self.extract_ge_anatomy_data(value);
					data.ge_anatomy_term = text_data[1];
					data.ge_anatomyid = text_data[0];
				}
				
				//set text annotations for abnormal anatomy
				if (value['abn_anatomy'] != undefined){
					var text_data = self.extract_abn_anatomy_data(value);
					data.abn_anatomy_term = text_data[1];
					data.abn_anatomyid = text_data[0];
				}
				
				//set text annotations for phenotype
				if (value['phenotype'] != undefined){
					var text_data = self.extract_phenotype_data(value);
					data.phenotype_term = text_data[1];
					data.phenotype_id = text_data[0];
				}
				
				//synchronise object state with database
				if (value.params.get("status") == "deleted"){
					if (value.params.get("new") == false){
						if(self.deleteAnnotations(data, key)){
							//delete annotation from map
						}
							
					}else{
						//delete annotation from map
					}
					
				}else if (value.params.get("status") == "changed"){
					if (value.params.get("new") == true){
						//if successfully added to database, mark as new = false
						if (self.createAnnotations(data, key)){
							;
						}					
					}else {
						if (self.updateAnnotations(data, key)){
							;
						}
					}
				}
							
			});
	   },
	   
	   extract_XYZ: function(key){
		   var imageWidth = this.imageDimensions[0];
		   var imageHeight = this.imageDimensions[1];
		
			if (key.originalTop != undefined){
				var x0 = key.originalLeft;
				var y0 = key.originalTop;
			}else{
				var x0 = key.get('left');
				var y0 = key.get('top');
			}
		
			var x_values = [ x0 * 100 / imageWidth, (x0 + key.get('width')) * 100 / imageWidth ];
			var y_values = [y0 * 100 / imageHeight, (y0 + key.get('height')) * 100 / imageHeight ] ;
			var z_values = [0, 0];
	
			return [x_values, y_values, z_values];
		
	   },
	   
	   extract_dpt_anatomy_data : function(data){
			var dpt_anatomyids = [];
			var dpt_anatomy_terms = [];
		
			data['dpt_anatomy'].forEach(function(value, key){
				dpt_anatomy_terms.push(value);
				dpt_anatomyids.push(key);
			});
		
			return [dpt_anatomyids, dpt_anatomy_terms];
		
	   },
	   
	   extract_ge_anatomy_data : function(data){
			var ge_anatomyids = [];
			var ge_anatomy_terms = [];
		
			data['ge_anatomy'].forEach(function(value2, key2){
				ge_anatomy_terms.push(value2);
				ge_anatomyids.push(key2);
			});
		
			return [ge_anatomyids, ge_anatomy_terms];
		
	   },
	   
	   extract_abn_anatomy_data : function(data){
	
			var abn_anatomyids = [];
			var abn_anatomy_terms = [];
		
			data['abn_anatomy'].forEach(function(value2, key2){
				abn_anatomy_terms.push(value2);
				abn_anatomyids.push(key2);
			});
			
			return [abn_anatomyids, abn_anatomy_terms];
		
	   },
	   
	   extract_phenotype_data : function(data){
		
			var phenotype_ids = [];
			var phenotype_terms = [];
		
			data['phenotype'].forEach(function(value2, key2){
				phenotype_terms.push(value2);
				phenotype_ids.push(key2);
			});
		
			return [phenotype_ids, phenotype_terms];
	   },
	   
	   extract_freetext_data : function(data){
	   	
	   },
	   
	   createAnnotations: function(data, key){
	
			var createdData = data;
			createdData.action = "create";
			var postData = jQuery.param(createdData, true);
			console.log(postData);
			
			//make ajax call below
			
			if (this.postAnnotations(postData, key, createdData.action)){
				return true;
			}
			
			return true;
	   },
	   
	   updateAnnotations: function(data, key){
		   var anns = this.getAnnotations();
		  
			var createdData = data;
			createdData.action = "edit";
 		   	
			if (anns.has(key)){
 			   var text_anns = anns.get(key);
 			   if (text_anns.params.has("phisid")){
 				   createdData.phisid = text_anns.params.get("phisid");
 			   }
 		   	}
		   
			var postData = jQuery.param(createdData, true);
		
			console.log(postData);
		
			//make ajax call below
			
			if (this.postAnnotations(postData, key, createdData.action)){
				return true;
			}
			
			return true;
	   },
	   
	   deleteAnnotations: function(data, key){
			
		   var anns = this.getAnnotations();
		   
	   		var createdData = data;
	   		createdData.action = "delete";
			
 		   	if (anns.has(key)){
 			   var text_anns = anns.get(key);
 			   if (text_anns.params.has("phisid")){
 				   createdData.phisid = text_anns.params.get("phisid");
 			   }
 		   	}
		   
	   		var postData = jQuery.param(createdData, true);
		
	   		console.log(postData);
			console.log("Deleting annotation data:");
			
			if (this.postAnnotations(postData, key, createdData.action)){
				return true;
			}
			
			return true;
	   },
	   
	   postAnnotations: function(data, key, action){
		   var self = this;
		   
		   var url  = this.annotation_data_store + data;
		 				
			var iqs_request = jQuery.ajax({
				  						method: "POST",
			  							url: url,
				  						//data: data,
										//crossdomain: true,
										dataType:'json',
										//traditional:true
									});

			var iqs_response =  iqs_request.done(function( response ) {
				console.log(response);
				var message = response.status;
				var anns = self.getAnnotations();
				
				if(message == "success"){
					if (anns.has(key)){
						var text_anns = anns.get(key);
					
						if (action == "create"){
							text_anns.params.set("new", false);
							text_anns.params.set("phisid", response.annotationId);
						}
						
						text_anns.params.set("status", "unchanged");
						anns.set(key, text_anns);
					}else{
						console.log("Annotation does not exist in map");
					}
				}else if(message == "fail"){
					if (anns.has(key)){
						var text_anns = anns.get(key);
						text_anns.params.set("status", "unchanged");
						anns.set(key, text_anns);
					}
				}
				
				createAlert(response);
				
				return true;
			});

			iqs_request.fail(function( jqXHR, textStatus ) {
			  console.log(textStatus );
			  return false;
		  });
		  
	   },
	   addModel: function(graphicalObject){
	   	
	   },
	   
	   updateModel: function(graphicalObject){
	   	
	   },
	   
	   deleteModel: function(graphicalObject){
	   	
	   },
	   
	   toggleMode: function(){
	   	
	   },
	   
	   
	   //Toggle button functions
	   setToggleButtonState: function(state){
		   jQuery('#' + this.toggler).bootstrapSwitch('state', state);
	   },
	   
	   getToggleButtonState: function(){
		   return jQuery('#' + this.toggler).bootstrapSwitch('state');
	   },
	   
	   getToogleButton: function(){
		   return jQuery('#' + this.toggler);
	   },
	   
	   toggleButtonSwitchHandler: function(event, state) {
		   //jQuery(this).bootstrapSwitch('toggleState', true);
		   
		   var buttonState = jQuery(this).bootstrapSwitch('state');
		   
		   if (buttonState){
			   AnnotationTool.enableDrawing();
		   }else{
			   AnnotationTool.disableDrawing();
		   }
		   
	  	   jQuery('#imagepanel').css('z-index', 10);
	  	   jQuery('#drawingpanel').css('z-index', 100);
		   
		   
		   //tearDownCanvasEventtHandlers
		  /* 
		   if (buttonState){
	  		   jQuery('#imagepanel').css('z-index', 100);
	  	 	   jQuery('#drawingpanel').css('z-index', 10);
		   }else{
			  	jQuery('#imagepanel').css('z-index', 10);
			  	jQuery('#drawingpanel').css('z-index', 100);
		   }
  		   */
	   },
	   
	   isToggleButtonClicked: function(){
		   return this.toggle_button_clicked;
	   },
	   
	   
	   //Event trigger functions
	   triggerEvent: function(eventObject, event){
		   if (eventObject == 'canvas'){
		   		this.canvas.trigger(event);
		   }else if (eventObject == 'toggleButton'){
			   jQuery('#'+this.toggler).trigger(event);
		   }else if (eventObject == this.shapes.rect + "-button"){
		   	 jQuery('#'+eventObject).trigger(event);
		   }else if (eventObject == this.shapes.line + "-button"){
		   	 jQuery('#'+eventObject).trigger(event);
		   }else if (eventObject == this.shapes.point + "-button"){
		   	 jQuery('#'+eventObject).trigger(event);
		   }else if (eventObject == this.shapes.free + "-button"){
		   	 jQuery('#'+eventObject).trigger(event);
		   }else if (eventObject == this.actions.save + "-button"){
		   	 jQuery('#'+eventObject).trigger(event);
		   }else if (eventObject == this.actions.undo + "-button"){
		   	 jQuery('#'+eventObject).trigger(event);
		   }else if (eventObject == this.actions.redo + "-button"){
		   	 jQuery('#'+eventObject).trigger(event);
		   }else if (eventObject == this.actions.edit + "-button"){
		   	 jQuery('#'+eventObject).trigger(event);
		   }else if (eventObject == this.actions.delete + "-button"){
		   	 jQuery('#'+eventObject).trigger(event);
		   }else if (eventObject == "load-ontology-button"){
		   	 jQuery('#'+eventObject).trigger(event);
		   }else if (eventObject == "jstree-anchor"){
		   	 jQuery('.'+eventObject).trigger(event);
		   }else{
		   	 eventObject.trigger(event);
		   }
		   
	   },
	   
	   //Drawing and overlay addition functions
	   addOverlay: function(SVGObject){
	   	
	   },
	   
	   draw: function(shape){
	   	
	   },
	   
	   drawFree: function(eventObject){
	   	console.log("Free draw function not yet implemented");
	   },
	   
	   drawRect: function(options){
           if (typeof options.target != "undefined") {
               return;
           } else {
			   
  	         /*var startY = ( options.e != undefined && options.e.layerY != undefined ? options.e.layerY : 100 ),
  			 	 startX = ( options.e != undefined && options.e.layerX != undefined ? options.e.layerX : 100 );
			 */
			  
			   var currentModel = AnnotationTool.getCurrentAnnotationModel();
			   
			   //console.log(currentModel);
			   
			   var startY = ( options.e != undefined && options.e.layerY != undefined ? options.e.layerY : ( currentModel != undefined && currentModel[1] != undefined ? currentModel[1]: 100 ) ),
  			 	startX = ( options.e != undefined && options.e.layerX != undefined ? options.e.layerX : ( currentModel != undefined && currentModel[0] != undefined ? currentModel[0] : 100 ) );
				 
  	         console.log("[Annotation Tool] Rectangle start X: " + startX +" ; Rectangle start Y :" + startY);

  	         var rect = new fabric.Rect({
  	             top : startY,
  	             left : startX,
  	             width : 0,
  	             height : 0,
  	             fill : 'transparent',
  	             stroke: 'red',
  	             strokewidth: 4
  	         });
			 
  	         this.on('mouse:move', function (options) {
			 
				 //console.log(options.e.layerX, options.e.layerY );
				 
				 /*
  				 var width = ( options.e != undefined && options.e.layerX != undefined ? options.e.layerX - startX : 100 ),
  				 	 heigth = ( options.e != undefined && options.e.layerY != undefined ? options.e.layerY - startY : 100 );
			 	*/
			 	var width = ( options.e != undefined && options.e.layerX != undefined ? options.e.layerX - startX : ( currentModel != undefined && currentModel[2] != undefined ? currentModel[2] : 100 ) ),
			 		 heigth = ( options.e != undefined && options.e.layerY != undefined ? options.e.layerY - startY : ( currentModel != undefined && currentModel[3] != undefined ? currentModel[3] : 100 ) );
				 				 
  	             rect.set('width', width );
  	             rect.set('height', heigth); 
				 if (currentModel[4].startsWith('wtsi') || currentModel[4].startsWith('tracr'))
					 rect.set('strokeDashArray',[5, 15]);
  				 rect.saveState();
  				 rect.setCoords();
				 rect.on("selected", function(){
					 //console.log("im selected");
				 });
  	         });
			 
  			  this.add(rect);
			
           }
	   },

	   drawPoint: function(options){
		   console.log("[" + this.myname + "] Point draw function not yet implemented");
	   },
	   
	   drawLine: function(eventObject){
	   	console.log("[" + this.myname + "] Line draw function not yet implemented");
	   },
	   
	   setAttr: function(el, attr, value){
	   	
	   },
	   
	   destroyToggleButton: function(){
	   	jQuery('#' + this.toggler).bootstrapSwitch('destroy');
	   }
	   
   };
    
}(OpenSeadragon));