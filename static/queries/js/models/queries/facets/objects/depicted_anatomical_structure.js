function DepictedAnatomicalStructure() {
	this.myname = "DepictedAnatomicalStructure";
};

/**
 * Register a canvas with this controller.
*/
DepictedAnatomicalStructure.prototype.setName= function() {
	console.log("[DepictedAnatomicalStructure] ");
};

/**
 * Get the class name.
*/
DepictedAnatomicalStructure.prototype.getName= function() {
	return this.myname;
};
