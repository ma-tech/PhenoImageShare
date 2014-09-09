function PlatformFacets() {
	this.canvas = null;
	this.myname = "Facet Tool";
};

/**
 * Register a canvas with this controller.
*/
PlatformFacets.prototype.setCanvas= function() {
	console.log("[Facets] ");
};

/**
 * Get the class name.
*/
PlatformFacets.prototype.getName= function() {
	return this.myname;
};
