function Description() {
	this.myname = "Description";
};

/**
 * Register a canvas with this controller.
*/
Description.prototype.setName= function() {
	console.log("[Description] ");
};

/**
 * Get the class name.
*/
Description.prototype.getName= function() {
	return this.myname;
};
