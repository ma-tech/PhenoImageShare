function Phenotype_Facets() {
	this.canvas = null;
	this.myname = "Phenotype Facet Controller";
};

/**
 * Register a canvas with this controller.
*/
Phenotype_Facets.prototype.setCanvas= function() {
	console.log("[Phenotype Facets] ");
};

/**
 * Get the registered name of class.
*/
Phenotype_Facets.prototype.getName= function() {
	return this.myname;
};
