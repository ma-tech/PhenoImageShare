function PhenotypeAnnotation() {
	this.myname = "PhenotypeAnnotation";
};

/**
 * Register a canvas with this controller.
*/
PhenotypeAnnotation.prototype.setName= function() {
	console.log("[PhenotypeAnnotation] ");
};

/**
 * Get the class name.
*/
PhenotypeAnnotation.prototype.getName= function() {
	return this.myname;
};
