function DrawingTool() {
	this.canvas = null;
	this.myname = "Drawing Tool";
	
	this.shapes = {'roi': true, 'line': false, 'feducial':false, 'arrow':false};
	
	this.tools = {'drawer': true, 'annotator': false};
	
	this.selectedShape = "rect"; //Get selected shape from GUI.
	
	this.selectedAction = null; //Get selected shape from GUI.
	
	this.selectedMode = "edit"; //Get selected tool from GUI or event type (save, draw, etc).
	
	this.models = [];
	
	this.numModels = this.models.length;
	
	this.modelsData = [];
	
	//Annotation types.
	this.ROI = "roi";
	
	this.FDP = "fiducial_point";
}

/**
 * Recomposites the drawing and temporary canvases onto the screen
*/

DrawingTool.prototype.resetCanvasCompositeOperation = function(operation) {
	this.compositeOperation = operation;
};

/**
 * Enable editting mode.
*/

DrawingTool.prototype.setEditable = function(editable) {
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

DrawingTool.prototype.selectObject = function(object) {

};

/**
 * Enable selector mode.
*/

DrawingTool.prototype.createModels = function(modelsData) {
	
	this.modelsData = modelsData;
	this.numModels = modelsData.length;
	
	console.log("[DrawingTool] Creating "+this.numModels+" models");
	
	for (var i=0; i < this.numModels; i++){
		if (modelsData[i].type == this.ROI){
			console.log("[DrawingTool] Creating ROI "+modelsData[i].id);
			
			//create ROI here.
		}
		
		this.models.push(model)
	}
	
};

/**
 * Enable selector mode.
*/

DrawingTool.prototype.getModels = function() {
	return this.models;
};

/**
 * Get name.
*/

DrawingTool.prototype.getName = function() {
	return this.myname;
};

/**
 * Enable selector mode.
*/

DrawingTool.prototype.setCanvas= function(canvas) {
	console.log("[DrawingTool] Registering Canvas: "+canvas.myname);
	this.canvas = canvas;
};

/**
 * Enable selector mode.
*/

DrawingTool.prototype.getCanvas= function() {
	return this.canvas;
};

/**
 * Drag selected shape.
*/

DrawingTool.prototype.dragSelection = function(selectedShape) {
	
};


/**
 * Undo action.
*/

DrawingTool.prototype.undoAction = function(action) {

};

/**
 * Undo action.
*/

DrawingTool.prototype.redoAction = function(action) {

};

/**
 * Cut Selected Shape.
*/

DrawingTool.prototype.cutShape = function(shape) {

};

/**
 * Paste Selected Shape.
*/

DrawingTool.prototype.pasteShape = function(shape, location) {

};

/**
 * Set line width for the selected shape.
*/

DrawingTool.prototype.setLineWidth = function(size) {

};


/**
 * Function to clear canvas.
*/

DrawingTool.prototype.clearModels = function() {
	console.log("[Drawing Tool] Clearing canvas drawings...")
};

/**
 * Function to clear last unsaved, drawn model.
*/

DrawingTool.prototype.clearLastModel = function() {
	console.log("[Drawing Tool] Clearing unsaved model...")
};

/**
 * Function to clear last unsaved, drawn model.
*/

DrawingTool.prototype.displayModels = function() {
	console.log("[Drawing Tool] Displaying models obtained from data source...");
};

/**
 * Perform draw action for the selected shape.
*/

DrawingTool.prototype.startDrawing = function(event) {
	if (this.canvas.selectedShape == "tool-roi") {
		//this.canvas.moving = true;
		this.startDrawingRect(event);
	}else if (this.canvas.selectedShape == "tool-feducial") {
		this.startDrawingCircle(event);
		//this.canvas.moving = true;
	}else if (this.canvas.selectedShape == "tool-arrow") {
		this.startDrawingArrow(event);
		//this.canvas.moving = true;
	}else if (this.canvas.selectedShape == "tool-line") {
		this.startDrawingLine(event);
		//this.canvas.moving = true;
	}else if (this.canvas.selectedShape == "tool-free") {
		this.startDrawingFree(event);
		//this.canvas.moving = true;
	}
};

DrawingTool.prototype.draw = function(event) {
	if (this.canvas.selectedShape == "tool-roi") {
		this.drawRect(event);
	}else if (this.canvas.selectedShape == "tool-feducial") {
		this.drawCircle(event);
	}else if (this.canvas.selectedShape == "tool-arrow") {
		this.drawArrow(event);
	}else if (this.canvas.selectedShape == "tool-line") {
		this.drawLine(event);
	}else if (this.canvas.selectedShape == "tool-free") {
		this.drawFree(event);
	}
};

/**
 * Perform draw action for the selected shape.
*/

DrawingTool.prototype.drawCircle = function(event) {
	
        var mousePos = this.canvas.stage.getPointerPosition();
      	console.log("Moving mouse position: (x, y): (" + mousePos.x + ","+ mousePos.y+" )");
		
		var x = Math.min(mousePos.x,	x0),
			y = Math.min(mousePos.y,	y0),
			radius = Math.sqrt((mousePos.x - x0) * (mousePos.x - x0) + (mousePos.y - y0) * (mousePos.y- y0)) / 2;
			h = Math.abs(mousePos.y - y0) / 2,
			l = Math.abs(mousePos.x - x0) / 2;
			
		if (mousePos.x > x0) {
			x = mousePos.x - l;
		}else if (mousePos.x < x0) {
			x = mousePos.x + l;
		}else {
			x = mousePos.x;
		} 
		
		if (mousePos.y > y0) {
			y = mousePos.y - h;
		}else if (mousePos.y < y0){
			y = mousePos.y  + h;
		}else {
			y = mousePos.y ;
		} 
			
		shape.setX(x);
		shape.setY(y);
	    shape.setRadius(radius);
		
		//this.canvas.moving = true;
		this.canvas.layer.add(shape.getShape());
		this.canvas.layer.drawScene();
};

/**
 * Perform draw action for the selected shape.
*/

DrawingTool.prototype.drawRect= function(event) {
	
        var mousePos = this.canvas.stage.getPointerPosition();
      	console.log("Moving mouse position: (x, y): (" + mousePos.x + ","+ mousePos.y+" )");
		
		var x = Math.min(mousePos.x,x0),
        	y = Math.min(mousePos.y,y0),
			h = Math.abs(mousePos.y - y0),
			w = Math.abs(mousePos.x - x0);
	 
		shape.setX(x);
		shape.setY(y);
	    shape.setWidth(w);
       	shape.setHeight(h);
		
		//this.canvas.moving = true;
		this.canvas.layer.add(shape.getShape());
		this.canvas.layer.drawScene();
};

/**
 * Perform draw action for the selected shape.
*/

DrawingTool.prototype.drawArrow= function(event) {
		var mousePos = this.canvas.stage.getPointerPosition();
     	console.log("[Drawing Tool] Drawing Line at point (x, y): (" + mousePos.x + ","+ mousePos.y+" )");
		//console.log("[Arrow]: "+ customeLine.custLine());
		x = mousePos.x;
		y = mousePos.y;
		
		points = [x0, y0, x, y];
		shape.setPoints(points);
		  
		//this.canvas.moving = true;
		this.canvas.layer.add(shape.getShape());
		this.canvas.layer.drawScene();	
};


/**
 * Stop drawing.
*/

DrawingTool.prototype.startDrawingCircle = function(event) {
	var mousePos = this.canvas.stage.getPointerPosition();
	console.log("[Drawing Tool] Started drawing Feducial at point (x, y): (" + mousePos.x + ","+ mousePos.y+" )");
    //start point and end point are the same
	
	x0 = mousePos.x;
	y0 = mousePos.y;
	radius = 0;
	draggable = true;
	
	//initialize a circle.
	shape = new Circle(x0, y0, radius, draggable); 
	
	//this.canvas.moving = true;
	
};

/**
 * Stop drawing.
*/
DrawingTool.prototype.startDrawingRect = function(event) {
	var mousePos = this.canvas.stage.getPointerPosition();
	console.log("[Drawing Tool] Started drawing ROI at point (x, y): (" + mousePos.x + ","+ mousePos.y+" )");
    //start point and end point are the same
	
	x0 = mousePos.x;
	y0 = mousePos.y;
	draggable = true;
	
	shape = new Rectangle(x0, y0, draggable);
	
	//this.canvas.moving = true;
};

/**
 * Stop drawing.
*/

DrawingTool.prototype.startDrawingArrow = function(event) {
	var mousePos = this.canvas.stage.getPointerPosition();
	console.log("[Drawing Tool] Started drawing Line from point (x, y): (" + mousePos.x + ","+ mousePos.y+" )");
    //start point and end point are the same
	
	x0 = mousePos.x;
	y0 = mousePos.y;
	draggable = true;
	
	shape = new Line(x0, y0, x0, y0, draggable);
	
	//this.canvas.moving = true;	 
};

/**
 * Stop drawing.
*/
DrawingTool.prototype.startDrawingFree = function(event) {
	console.log("[Drawing Tool] Started drawing free");
};

/**
 * Stop drawing.
*/

DrawingTool.prototype.stopDrawing = function(event) {
	this.canvas.moving = false;
	this.saveDrawing();
};

/**
 * Save the drawing into database (through AJAX perhaps).
*/

DrawingTool.prototype.saveDrawing = function() {
	this.models.push(shape);
	console.log("[Drawing Tool] Saving object into model."+this.models.length+" objects saved in model");
	
	for (i=0; i< this.models.length; i++){
		console.log("[Drawing Tool] Object("+(i+1)+") type: "+ this.models[i].getType());
	}
};


