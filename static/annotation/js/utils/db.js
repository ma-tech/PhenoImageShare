function DBUtil(imageDimensions, roiData) {
	this.myname = "Model Loader";
	this.modelsData = [];
	this.imageDimensions = imageDimensions;
	this.roiData = roiData;
	this.numModels = this.modelsData.length;
	
	console.log("["+this.myname+"] Initialising " + this.myname);
};

/**
 * Function to load all models data from DB using AJAX. 
*/

DBUtil.prototype.createModelData = function(roiData) {
	console.log("[Model Loader] Image dimension (width, height) = ("+ this.imageDimensions[0] + "," + this.imageDimensions[1] + ")");
	
	for(var i = 0; i < this.roiData.length; i++){
		var roi_width = this.imageDimensions[0] * (this.roiData[i].x_coordinates[1] / 100) - this.imageDimensions[0] * (this.roiData[i].x_coordinates[0] /  100);
		
		var roi_height= this.imageDimensions[1] * (this.roiData[i].y_coordinates[1] / 100) - this.imageDimensions[1] * (this.roiData[i].y_coordinates[0] / 100);
		var roi_dimension = roi_width + " x " + roi_height;
	
		var x0 = this.roiData[i].x_coordinates[0] * this.imageDimensions[0] / 100;
		var y0 = this.roiData[i].y_coordinates[0] * this.imageDimensions[1] / 100; 
		var draggable = false;
		
		obj = roi_width == 20 ? new Point(x0, y0, draggable, i) : new Rectangle(x0, y0, draggable, i);
	
		obj.setX(x0);
		obj.setY(y0);
		obj.setWidth(roi_width);
		obj.setHeight(roi_height);
		obj.setStatus("existing");
		obj.setImageId(this.roiData[i].associated_image);
		
		this.modelsData.push(obj);
	}
	return this.modelsData;
	
};

DBUtil.prototype.getModelObjects = function(roiData) {
	return this.modelsData;
}

/**
 * Get image dimension.
*/

DBUtil.prototype.getDimensions = function(roiId) {
	return this.imageDimensions;
};


/**
 * Function to load a single model's data from DB using AJAX.
*/

DBUtil.prototype.loadModel = function(roiId) {
	console.log("["+this.myname+"] Loading data for : "+modelID);
};
