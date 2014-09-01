function AnatomyFacets() {
	this.canvas = null;
	this.myname = "Facet Tool";
};

/**
 * Register a canvas with this controller.
*/
AnatomyFacets.prototype.setCanvas= function() {
	console.log("[Facets] ");
};

/**
 * Get the class name.
*/
AnatomyFacets.prototype.getName= function() {
	return this.myname;
};
