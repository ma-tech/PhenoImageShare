function Expression_Facets() {
	this.canvas = null;
	this.myname = "Expression Facet Controller";
};

/**
 * Register a canvas with this controller.
*/
Expression_Facets.prototype.setCanvas= function() {
	console.log("[Facets] ");
};

/**
 * Get the name of this class.
*/
Expression_Facets.prototype.getName= function() {
	return this.myname;
};
