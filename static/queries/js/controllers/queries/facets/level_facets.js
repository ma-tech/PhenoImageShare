function LevelFacets() {
	this.canvas = null;
	this.myname = "Facet Tool";
};

/**
 * Register a canvas with this controller.
*/
LevelFacets.prototype.setCanvas= function() {
	console.log("[Facets] ");
};

/**
 * Get the class name.
*/
LevelFacets.prototype.getName= function() {
	return this.myname;
};
