/**
 * Construct a new Event Handler Tool object
 *
 * @param canvasId [string] the canvas DOM ID, e.g. 'drawingcanvas'
 * @param image:  URL to background (bottom) image displayed on canvas.
 */
function EventHandler() {
	this.canvas = null;
	this.myname = "Event Handler";
	this.controllers = null;
	this.currentController = null;
	this.drawingController = null;
	
	console.log("["+this.myname+"] Constructing " + this.myname);
}

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.setCanvas= function(canvas) {
	console.log("["+this.myname+"] Registering Canvas: "+canvas.myname);
	this.canvas = canvas;
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.addController= function(controller) {
	console.log("["+this.myname+"]  Registering Controller: "+controller.myname);
	this.currentController = controller;
	this.controllers.push(controller)
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.setCurrentController= function(controller) {
	console.log("["+this.myname+"] Setting Current Controller to: "+controller.myname);
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
	console.log("["+this.myname+"]  Setting Current Controller: "+controllers[0].myname);
	this.currentController = controllers[0];
	this.controllers = controllers;
	
	this.drawingController = controllers[0];
	this.annotationController = controllers[1];
	
	console.log("["+this.myname+"]  Registered Controllers are : " + this.controllers[0].getName() + " and " + this.controllers[1].getName());
}


/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.mouseDown= function(event) {
	console.log("["+this.myname+"] Mouse down");
	
	this.canvas.clicked = true;
	
    if (this.canvas.moving){
        this.canvas.moving = false;
		this.canvas.layer.draw();
    } else {
		this.currentController.startDrawing(event);
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
	if(this.canvas.moving || (this.canvas.selectedShape == "tool-point" && !this.canvas.pointExists)){
		this.canvas.moving = false;
		this.currentController.stopDrawing(event);
		this.setCurrentController(this.canvas.controllers[1]);
		//this.addAnnotation();
	}
	
	this.canvas.layer.draw();
	this.canvas.clicked = false;
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.setSelectedTool= function(tool) {
	this.canvas.selectedShape = tool;
	
	if(tool == "tool-rectangle" || tool == "tool-point"){
		var annotationObjects = this.drawingController.getModels();
		var numObjects = annotationObjects.length;
		//make annotation objects undraggable
		
		for (var i = 0 ; i < numObjects ; i ++){
			annotationObjects[i].getShape().draggable(false);
		}
		
	}
	
	console.log("["+this.myname+"] Tool selected: "+tool);
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.setSelectedMode= function(mode) {
	this.canvas.selectedMode = mode;
	console.log("["+this.myname+"] Mode selected: "+this.canvas.selectedMode);
	
	if (mode == "tool-drag"){
		var annotationObjects = this.drawingController.getModels();
		var numObjects = annotationObjects.length;
		
		for (var i = 0 ; i < numObjects ; i ++){
			annotationObjects[i].getShape().draggable(true);
		}
	}
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.setSelectedEditMode= function(mode) {
	this.canvas.selectedEditMode = mode;
	console.log("["+this.myname+"] Edit mode selected: "+this.canvas.selectedEditMode);
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.setSelectedAction= function(action) {
	this.canvas.selectedAction = action;
	console.log("["+this.myname+"] Action selected: "+action);
};

/**
 * Set the drawing canvas, in order to receive events from them.
*/
EventHandler.prototype.addAnnotation= function() {
	this.currentController.addAnnotation();
	console.log("["+this.myname+"] Clicked button: "+document.getElementById("roi_modal_edit_button").value);
	
	//Trigger a button click even (an hack to call up our modal annnotation box)
	$("#roi_modal_add_button").trigger("click");
	
};

EventHandler.prototype.displayAnnotations = function(annotations) {
	//Calll drawing tool to display annotation on image: ensure the correct controller is set.
	this.setCurrentController(this.canvas.controllers[0]);
	this.currentController.displayAnnotations(annotations)
};