function Config() {
	this.data;
};

/**
 * Load data from IQS.
*/
Config.prototype.loadData = function(data) {
	this.data = data;
	console.log("[Query Config] Loading data: "+ this.data);
};

/**
 * Get data loaded from IQS.
*/
Config.prototype.getData = function() {
	console.log("[Retrieving data back]"+ this.data);
	return this.data;
};