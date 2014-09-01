function StageFacets() {
	this.canvas = null;
	this.myname = "Stage Facet";
};

/**
 * Register a canvas with this controller.
*/
StageFacets.prototype.setCanvas= function() {
	console.log("[Facets] ");
};

/**
 * Get the class name.
*/
StageFacets.prototype.getName= function() {
	return this.myname;
};
