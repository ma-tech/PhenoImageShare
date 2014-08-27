function PhiSCanvas(container, imageURL, controllers, modelsData, event_handler, error_handler) {
	
	console.log("Started Initialization of Drawing Canvas.");
	
	//this.canvas = $('#' + canvasID).get(0);
	
	this.container = container;

	this.mouseDown = false;

	this.layer = null; 
	
	this.shapes = {"ROI":"tool-roi", "FDP":"tool-fdp"};
	
	this.tools = {'drawer': true, 'annotator': false};
	
	this.selectedShape = this.shapes.ROI; //Get selected shape from GUI.
	
	this.selectedAction = null; //Get selected shape from GUI.
	
	this.modes = {"EDIT": "tool-edit", "VIEW": "tool-view"}
	
	this.selectedMode = this.modes.EDIT; //Get selected tool from GUI or event type (save, draw, etc).
	
	this.myname = "PhiS Canvas";
	
	this.modelsData = modelsData;
	
	this.canvasId = null;
	
	this.moving = false;
	
	this.clicked = false;
	
	this.imageURL = imageURL;
	
	this.controllers = controllers;
	
	this.event_handler = event_handler ;
	
	this.error_handler = error_handler ;
	
	var x0, y0, rect;
	
	var imageSizeWidth;
	
	var imageSizeHeight;
	
	this.backImage = new Image(); //declare a new image object for canvas background.
	
	this._initialisePhISCanvas() ; // finish setup from constructor now
	
	this.setImage(this.imageURL);

	this._eventListeners = {}; //holder for event listeners;
	
	this.modes = {'edit': false, 'view': true}; //get available defaults from configurations.js
	 
	this.currentMode = "view" ; //get this default from configurations.js
	
	this._setupPhISCanvas() ; // finish setup from constructor now
	
	//Variables to hold the drawing points on canvas. To be moved into DrawingTool controller.
};

/**
 * Set up the canvas, event handlers and listeners.
 */
PhiSCanvas.prototype._initialisePhISCanvas = function() {
	
	//Initialize drawing layer.
	this.layer = new Kinetic.Layer();
	
	//Initialize drawing stage.
	var container = this.container;
	
    this.stage = new Kinetic.Stage({
        container: this.container.id,
        width: 2000,
        height: 2000
    });
	
	this.stage.add(this.layer);
	
	// Initialise models data.
	this.initialiseModels(this.modelsData);
	
	//display models data (control this with the seleted toggle option on GUI).
	this.displayModels();
}

/**
 * Set up the canvas, event handlers and listeners.
 */
PhiSCanvas.prototype.initialiseModels = function(modelsData) {
	console.log("[PhIS Canvas] Initialising models...");
	this.controllers[0].createModels(modelsData);
}

/**
 * Set up the canvas, event handlers and listeners.
 */
PhiSCanvas.prototype.displayModels = function() {
	console.log("[PhIS Canvas] Displaying models...")
	
	//calls the draw method of the drawing tool.
}
	
/**
 * Set up the canvas, event handlers and listeners.
 */
PhiSCanvas.prototype._setupPhISCanvas = function() {
	
	//Set event hanlder with controllers.
	this.event_handler.setControllers(this.controllers);
	this.event_handler.setCanvas(this);
	
	//Setup our contollers with this canvas.
	var numControllers = this.controllers.length;
	
	for (var i=0; i < numControllers; i++){
		var controller = this.controllers[i];
		controller.setCanvas(this);
	}
	/**
	 * On mouse down, draw a line starting fresh.
	 * Method to be moved into event_handlers module.
	 */
	
	function mousedown_handler(e) {
		if(this.selectedMode == "tool-edit"){
			if (this.event_handler.getCurrentController() == this.controllers[1])
				this.event_handler.setCurrentController(this.controllers[0]);
			this.event_handler.mouseDown(e);
		}
	};

	/**
	 * On mouse move, if mouse down, draw a line.
	 * Method to be moved into event_handlers module.
	 */
	function mousemove_handler(e) {
		this.event_handler.mouseMove(e);
	};

	/**
	 * On mouseup.  (Listens on window to catch out-of-canvas events.)
	 * Method to be moved into event_handlers module.
	 */
	function mouseup_handler(e) {
		//this.moving = false; 
		if(this.selectedMode == "tool-edit"){
			this.event_handler.mouseUp(e);
		}
		
	};
	
	function setSelectedTool(e) {
		console.log("[PhIS Canvas]: Tool selected: "+e.target.id);
		this.event_handler.setSelectedTool(e.target.id);
	};
	
	function setSelectedMode(e) {
		console.log("[PhIS Canvas]: Mode selected: "+e.target.id);
		this.event_handler.setSelectedMode(e.target.id);
	};
	
	function setSelectedAction(e) {
		console.log("[PhIS Canvas]: Action selected: "+e.target.id);
		this.event_handler.setSelectedMode(e.target.id);
	};

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

	this.stage.on("mousedown", mousedown_handler.bind(this));
	this.stage.on("mousemove", mousemove_handler.bind(this));
	this.stage.on("mouseup", mouseup_handler.bind(this));
	
	//Capture events and register event handlers for the drawing tool buttons ().
	$("#tool-roi" ).on( "click", setSelectedTool.bind(this));
	$("#tool-feducial" ).on( "click", setSelectedTool.bind(this));
	$("#tool-arrow" ).on( "click", setSelectedTool.bind(this));
	
	//mode buttons.
	$("#tool-edit" ).on( "click", setSelectedMode.bind(this));
	$("#tool-select" ).on( "click", setSelectedMode.bind(this));
	$("#tool-drag" ).on( "click", setSelectedMode.bind(this));
	
	//action/operation buttons
	$("#tool-undo" ).on( "click", setSelectedAction.bind(this));
	$("#tool-redo" ).on( "click", setSelectedAction.bind(this));
	$("#tool-save" ).on( "click", setSelectedAction.bind(this));
	$("#tool-copy" ).on( "click", setSelectedAction.bind(this));
	$("#tool-cut" ).on( "click", setSelectedAction.bind(this));
	$("#tool-paste" ).on( "click", setSelectedAction.bind(this));
	
	console.log("Completed Initialization of Drawing Canvas.");
};

/**
 * Define the PhIS Image to draw over.
 */
PhiSCanvas.prototype.setImage = function(imageURL) {
	this.imageURL = imageURL;
	if (this.imageURL) { //if imageURL is set,
		this._loadImage(this.imageURL);
	}else {
		return false;
	}
};

/**
 * Loads the PhIS image to draw over.
*/

PhiSCanvas.prototype._loadImage = function(imageURL) {
	imageObj = this.backImage;
	layer = this.layer;
	stage = this.stage;
	
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
						 
						 console.log("Adding image; Layer="+layer +"; Stage="+stage.container().id+", Image="+imageObj.width);
  		                 layer.add(image);
  		                 stage.draw();
  	 }

  	imageObj.src = imageURL;
	this.imageSizeWidth = this.backImage.width;
	this.imageSizeHeight = this.backImage.height;
	
	console.log("Loading Image: Dimensions of the loaded image : width x height = "+ imageObj.width +" x "+ imageObj.height);
    
};


/**
 * Recomposites the drawing and temporary canvases onto the screen
*/

PhiSCanvas.prototype.resetCanvasCompositeOperation = function() {

};

/**
 * Enable editting mode.
*/

PhiSCanvas.prototype.setEditable = function(editable) {
	if (editable){
		this.modes.edit = true;
	}
	else{
		this.modes.view = false;
	}	
};

/**
 * Enable selector mode.
*/

PhiSCanvas.prototype.selectShape = function(shape) {

};

/**
 * Drag selected shape.
*/

PhiSCanvas.prototype.dragSelection = function(selectedShape) {
	
};


/**
 * Undo action.
*/

PhiSCanvas.prototype.undoAction = function(action) {

};

/**
 * Undo action.
*/

PhiSCanvas.prototype.redoAction = function(action) {

};

/**
 * Cut Selected Shape.
*/

PhiSCanvas.prototype.cutShape = function(shape) {

};

/**
 * Paste Selected Shape.
*/

PhiSCanvas.prototype.pasteShape = function(shape, location) {

};

/**
 * Set line width for the selected shape.
*/

PhiSCanvas.prototype.setLineWidth = function(size) {

};

/**
 * Perform draw action for the selected shape.
*/

PhiSCanvas.prototype.draw = function(shape) {

};

/**
 * Save the drawing into database (through AJAX perhaps).
*/

PhiSCanvas.prototype.saveDrawing = function(drawingParams) {

};

/**
 * returns the main canvas jQuery object for this controller
 */
PhiSCanvas.prototype.mainCanvas = function() {
	return this.canvas.main;
};

