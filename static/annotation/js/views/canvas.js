function PhiSCanvas(container, imageData, controllers, model, event_handler, error_handler) {
		
	//this.canvas = $('#' + canvasID).get(0);
	
	this.imageURL = imageData.url;
	this.imageId = imageData.id;
	
	this.myname = "Canvas";

	console.log("["+this.myname+"] Constructing " + this.myname);
	
	this.container = container;

	this.mouseDown = false;
	this.pointExists = false;

	this.layer = null;
	
	this.shapes = {"rectangle":"tool-rectangle", "point":"tool-point"};
	
	this.tools = {'drawer': true, 'annotator': false};
	
	this.selectedShape = this.shapes.rectangle; //Get selected shape from GUI.
	
	this.selectedAction = null; //Get selected shape from GUI.
	
	this.modes = {"EDIT": "tool-edit", "VIEW": "tool-view"};
	this.edit_modes = {"SELECTION": "tool-selection", "DRAW": "tool-draw", "DRAG": "tool-drag"};
	this.selectedEditMode = this.edit_modes.DRAW;
	this.hover_text = {"tool-drag": "Mode - Drag [D]", "tool-rectangle": "Tool - Rectangle [ R ]", "tool-circle": "Tool - Circle [ C ]", "tool-point": "Tool - Point [ P ]", "annotation-object":"Highlighting "};
	this.action_message = {"tool-rectangle": "Click and drag to draw a rectangle", "tool-point": "Click to mark a point on image"};
	this.selection_text = {"selected":"selected", "unselected":"unselected"};
	
	this.selectedMode = this.modes.EDIT; //Get selected tool from GUI or event type (save, draw, etc).
	
	this.model = model;
	
	this.canvasId = null;
	
	this.moving = false;
	
	this.clicked = false;
	
	
	this.controllers = controllers;
	
	console.log("["+this.myname+"] Registered controllers are : " + this.controllers[0].getName() + " and " + this.controllers[1].getName());
	
	this.event_handler = event_handler;
	
	this.error_handler = error_handler;
	
	var x0, y0, rect;
	
	var imageSizeWidth;
	
	var imageSizeHeight;
	
	this.backImage = new Image(); //declare a new image object for canvas background.
	
	this._initialisePhISCanvas(); // finish setup from constructor now
	
	this.setImage(this.imageURL);

	this._eventListeners = {}; //holder for event listeners;
	
	//this.modes = {'edit': false, 'view': true}; //get available defaults from configurations.js
	 
	//this.currentMode = "view"; //get this default from configurations.js
	
	this._setupCanvasEvents(); // finish setup from constructor now - setup canvas events.
	
	//Variables to hold the drawing points on canvas. To be moved into DrawingTool controller.
}

/**
 * Set up the canvas, event handlers and listeners.
 */


PhiSCanvas.prototype = {
	
_initialisePhISCanvas: function() {
		
	console.log("["+this.myname+"] Initialising " + this.myname);
	var dim = this.model.getDimensions();
	
	//Initialize drawing layer.
	this.layer = new Kinetic.Layer();
	
	//Initialize drawing stage.
	var container = this.container;
	
    this.stage = new Kinetic.Stage({
        container: this.container.id,
        width: dim[0],
        height: dim[1]
    });
	
	this.stage.add(this.layer);
	
	// Initialise models data.
	//this.initialiseModels(this.model.getModelObjects());
	
	//display models data (control this with the seleted toggle option on GUI).
	this.displayModels();
},

/**
 * Set up the canvas, event handlers and listeners.
 */
initialiseModels : function(modelsData) {
	console.log("["+this.myname+"] Initialising model on " + this.myname);
	//this.controllers[0].createModels(modelsData);
},

/**
 * Set up the canvas, event handlers and listeners.
 */
displayModels : function() {
	console.log("["+this.myname+"] Displaying model on " + this.myname);
	
	//calls the draw method of the drawing tool.
},
	
/**
 * Set up the canvas, event handlers and listeners.
 */
_setupCanvasEvents : function() {
	
	console.log("["+this.myname+"] Setting up " + this.myname);
	
	//Set event hanlder with controllers.
	this.event_handler.setControllers(this.controllers);
	this.event_handler.setCanvas(this);
	
	//Setup our contollers with this canvas.
	var numControllers = this.controllers.length;
	
	for (var i=0; i < numControllers; i++){
		var controller = this.controllers[i];
		controller.setCanvas(this);
	}

	/* register canvas event handlers with canvas. 
	 * Method used in case where we have to implement canvas drawing from scratch (i.e. without Kinetic)
	
	$(this.canvasId).on('mousedown', mousedown_handler.bind(this))
		.on('touchstart', mousedown_handler.bind(this));

	//register other DOM event handlers with the DOM document.
	$(document).on('mousemove', mousemove_handler.bind(this));
	$(document).on('touchmove', mousemove_handler.bind(this));

	$(document).on('mouseup', mouseup_handler.bind(this));
	$(document).on('touchend', mouseup_handler.bind(this));
	*/

	this.stage.on("mousedown", $.proxy(this.mousedown_handler,this));
	this.stage.on("mousemove", $.proxy(this.mousemove_handler,this));
	this.stage.on("mouseup", $.proxy(this.mouseup_handler,this));
	
	this.stage.on("mouseout", $.proxy(this.mouseout_handler,this));
	this.stage.on("mousein", $.proxy(this.mousein_handler,this));
	//this.stage.on("mouseup", $.proxy(this.mouseup_handler,this));
	
	
	//Capture events and register event handlers for the drawing tool buttons ().
	$("#tool-rectangle" ).on( "click", $.proxy(this.setSelectedTool, this));
	$("#tool-point" ).on( "click", $.proxy(this.setSelectedTool,this));
	$("#tool-polyline" ).on( "click", $.proxy(this.setSelectedTool,this));
	
	//mode buttons.
	$("#tool-edit" ).on( "click", $.proxy(this.setSelectedMode,this));
	$("#tool-selection" ).on( "click", $.proxy(this.setSelectedMode, this));
	$("#tool-drag" ).on( "click", $.proxy(this.setSelectedMode,this));
	
	//other events - hover over, mouse leave events
	$("#tool-rectangle").hover($.proxy(this.hover_handle, this));
	$("#tool-rectangle").mouseleave($.proxy(this.mouseleave_handle, this));
	$("#tool-drag").hover($.proxy(this.hover_handle, this));
	$("#tool-drag").mouseleave($.proxy(this.mouseleave_handle, this));
	$("#tool-point").hover($.proxy(this.hover_handle, this));
	$("#tool-point").mouseleave($.proxy(this.mouseleave_handle, this));
	
	/*
	//action/operation buttons
	$("#tool-undo" ).on( "click", setSelectedAction.bind(this));
	$("#tool-redo" ).on( "click", setSelectedAction.bind(this));
	$("#tool-save" ).on( "click", setSelectedAction.bind(this));
	$("#tool-copy" ).on( "click", setSelectedAction.bind(this));
	$("#tool-cut" ).on( "click", setSelectedAction.bind(this));
	$("#tool-paste" ).on( "click", setSelectedAction.bind(this));
	*/
	//Display annotation data on image
	
	console.log("["+this.myname+"] Done initialising " + this.myname);
},

/**
 * Define the PhIS Image to draw over.
 */
setImage : function(imageURL) {
	this.imageURL = imageURL;
	if (this.imageURL) { //if imageURL is set,
		this._loadImage(this.imageURL);
	}else {
		return false;
	}
},

hover_handle: function(e){
	$("#info_panel").text("    "+ this.hover_text[e.target.id]); //"Drag Mode [ D ]");
},

mouseleave_handle: function(e){
	if (this.selectedMode != "tool-drag")
		$("#info_panel").text("    "+ this.action_message[this.selectedShape]); //"Drag Mode [ D ]");
	else
		$("#info_panel").text("Click on an object to drag");
},

/**
 * On mouse down, draw a line starting fresh.
 * Method to be moved into event_handlers module.
 */

mousedown_handler : function (e) {
	if(this.selectedMode == "tool-edit"){
		if(this.selectedEditMode == "tool-draw"){
			if (this.event_handler.getCurrentController() == this.controllers[1]){	
			this.event_handler.setCurrentController(this.controllers[0]);
		}
		
		console.log("["+this.myname+"] Mouse down");
			
		this.event_handler.mouseDown(e);
	  }
	}
},

/**
 * On mouse move, if mouse down, draw a line.
 * Method to be moved into event_handlers module.
 */
mousemove_handler : function (e) {
	if (this.selectedMode != "tool-drag"){
		if (this.selectedShape == "tool-rectangle"){
			this.event_handler.mouseMove(e);
		}
	}
},

mousein_handler : function (e) {
	//this.event_handler.mouseIn(e);
},

mouseout_handler : function (e) {
	//this.event_handler.mouseIn(e);
},


/**
 * On mouseup.  (Listens on window to catch out-of-canvas events.)
 * Method to be moved into event_handlers module.
 */
mouseup_handler :function(e) {
	//this.moving = false; 
	if(this.selectedMode == "tool-edit"){
		if (this.selectedEditMode == "tool-draw"){
			this.event_handler.mouseUp(e);
		}
	}
	
},

setSelectedTool : function (e) {
	console.log("["+this.myname+"] Tool selected: "+e.target.id);
	
	this.selectedMode = this.modes.EDIT;
	this.event_handler.setSelectedTool(e.target.id);
	
	$("#info_panel").text("   "+ this.action_message[e.target.id]); 
	//re-enable drawing
},

setSelectedMode : function (e) {
	console.log("["+this.myname+"] Edit mode selected: "+e.target.id);
	this.event_handler.setSelectedMode(e.target.id);
	//this.event_handler.setSelectedMode(this.selectedMode);
	
},

setSelectedAction : function (e) {
	console.log("["+this.myname+"] Action selected: "+e.target.id);
	this.event_handler.setSelectedMode(e.target.id);
},

/**
 * Loads the PhIS image to draw over.
*/

_loadImage : function(imageURL) {
	imageObj = this.backImage;
	layer = this.layer;
	stage = this.stage;
	event_handler = this.event_handler;
	modelsData = this.model.createModelData();
	
  	 imageObj.onload = function (imageURL) {
	
  	 					var image = new Kinetic.Image({
  		                     x:0,
  		                     y: 0,
  		                     image: imageObj,
  		                     width: imageObj.width,
  		                     height: imageObj.height
  		                 });
						 
						 stage.width(imageObj.width);
						 stage.height(imageObj.height);
						 
						 console.log("Adding image; Layer="+layer +"; Stage="+stage.container().id+", Image= ("+imageObj.width+","+imageObj.height+")");
  		                 layer.add(image);
  		                 stage.draw();
						 
						 event_handler.displayAnnotations(modelsData);
  	 }

  	imageObj.src = imageURL;
	this.imageSizeWidth = this.backImage.width;
	this.imageSizeHeight = this.backImage.height;
	
	console.log("["+this.myname+"] Dimensions of the loaded image : width x height = "+ imageObj.width +" x "+ imageObj.height);    
},


/**
 * Recomposites the drawing and temporary canvases onto the screen
*/

resetCanvasCompositeOperation : function() {

},

/**
 * Enable editting mode.
*/

setEditable : function(editable) {
	if (editable){
		this.modes.edit = true;
	}
	else{
		this.modes.view = false;
	}	
},

/**
 * Enable selector mode.
*/

selectShape : function(shape) {

},

/**
 * Drag selected shape.
*/

dragSelection : function(selectedShape) {
	
},


/**
 * Undo action.
*/

undoAction : function(action) {

},

/**
 * Undo action.
*/

redoAction : function(action) {

},

/**
 * Cut Selected Shape.
*/

cutShape : function(shape) {

},

/**
 * Paste Selected Shape.
*/

pasteShape : function(shape, location) {

},

/**
 * Set line width for the selected shape.
*/

setLineWidth : function(size) {

},

/**
 * Perform draw action for the selected shape.
*/

draw : function(shape) {

},

/**
 * Save the drawing into database (through AJAX perhaps).
*/

saveDrawing : function(drawingParams) {

},

/**
 * returns the main canvas jQuery object for this controller
 */
mainCanvas : function() {
	return this.canvas.main;
}

}