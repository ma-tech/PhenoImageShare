/**
 * Construct a new Event Handler Tool object
 *
 * @param canvasId [string] the canvas DOM ID, e.g. 'drawingcanvas'
 * @param image:  URL to background (bottom) image displayed on canvas.
 */
function EventHandler() {
	this.canvas = null;
	this.controllers = null;
	this.currentController = null;
}

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.setCanvas= function(canvas) {
	console.log("[EventHandler] Registering Canvas: "+canvas.myname);
	this.canvas = canvas;
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.addController= function(controller) {
	console.log("[EventHandler] Registering Controller: "+controller.myname);
	this.currentController = controller;
	this.controllers.push(controller)
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.setCurrentController= function(controller) {
	console.log("[EventHandler] Setting Current Controller to: "+controller.myname);
	this.currentController = controller;
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.getCurrentController= function() {
	return this.currentController;
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.setControllers= function(controllers) {
	console.log("[EventHandler] Setting Current Controller: "+controllers[0].myname);
	this.currentController = controllers[0];
	this.controllers = controllers;
	
	console.log("[EventHandler] Registered Controllers: "+controllers.myname);
}


/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.mouseDown= function(event) {
	
	this.canvas.clicked = true;
	
    if (this.canvas.moving){
        this.canvas.moving = false;
		this.canvas.layer.draw();
    } else {
		this.currentController.startDrawing(event);
		//this.canvas.moving = true;
    }
};

/**
 * Get the registered canvas.
*/
EventHandler.prototype.mouseMove= function(event) {
	if (this.canvas.clicked) {
		this.canvas.moving = true;
		this.currentController.draw(event);
	}
};


/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.mouseUp= function(event) {
	if(this.canvas.moving){
		this.currentController.stopDrawing(event);
		this.setCurrentController(this.canvas.controllers[1]);
		this.addAnnotation();
	}
	
	this.canvas.clicked = false;
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.setSelectedTool= function(tool) {
	this.canvas.selectedShape = tool;
	console.log("[EventHandler]: Tool selected: "+tool);
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.setSelectedMode= function(mode) {
	this.canvas.selectedMode = mode;
	console.log("[EventHandler]: Mode selected: "+mode);
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.setSelectedAction= function(action) {
	this.canvas.selectedAction = action;
	console.log("[EventHandler]: Action selected: "+action);
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.addAnnotation= function() {
	this.currentController.addAnnotation();
	console.log("[EventHandler] Clicked button: "+document.getElementById("roi_modal_edit_button").value);
	
	//Trigger a button click even (an hack to call up our modal annnotation box)
	$("#roi_modal_add_button").trigger("click");
	
};