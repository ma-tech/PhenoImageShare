function ROI() {
	this.myname = "ROI";
};

/**
 * Register a canvas with this controller.
*/
ROI.prototype.setName= function() {
	console.log("[ROI] ");
};

/**
 * Get the class name.
*/
ROI.prototype.getName= function() {
	return this.myname;
};
