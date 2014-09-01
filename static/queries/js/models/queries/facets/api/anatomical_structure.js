function AnatomicalStructure() {
	this.myname = "Genotype Component";
};

/**
 * Register a canvas with this controller.
*/
AnatomicalStructure.prototype.setName= function() {
	console.log("[Anatomical Structure] ");
};

/**
 * Get the class name.
*/
AnatomicalStructure.prototype.getName= function() {
	return this.myname;
};
