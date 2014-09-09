function Facets() {
	this.canvas = null;
	this.myname = "Facet Tool";
};

/**
 * Register a canvas with this controller.
*/
Facets.prototype.setCanvas= function() {
	console.log("[Facets] ");
};

/**
 * Get the registered canvas.
*/
Facets.prototype.getName= function() {
	return this.myname;
};
