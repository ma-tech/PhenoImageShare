function DBUtil() {
	this.myname = "Model Loader";
	this.modelsData = [];
	this.numModels = this.modelsData.length;
	
};

/**
 * Function to load all models data from DB using AJAX. 
*/

DBUtil.prototype.loadModelsData = function() {
	console.log("[Model Loader] Loading data for all models. Total = "+this.numModels);
	
	return this.modelsData;
};

/**
 * Function to load a single model's data from DB using AJAX.
*/

DBUtil.prototype.loadModelData = function(modelID) {
	console.log("[Model Loader] Loading data for : "+modelID);
};
