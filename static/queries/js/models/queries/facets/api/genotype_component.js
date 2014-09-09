function GenotypeComponent() {
	this.myname = "Genotype Component";
};

/**
 * Register a canvas with this controller.
*/
GenotypeComponent.prototype.setName= function() {
	console.log("[Genotype Component] ");
};

/**
 * Get the class name.
*/
GenotypeComponent.prototype.getName= function() {
	return this.myname;
};
