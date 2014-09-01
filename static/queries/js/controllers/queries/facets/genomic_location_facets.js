function GenomicLocationFacets() {
	this.canvas = null;
	this.myname = "Genomic Location Facet";
};

/**
 * Register a canvas with this controller.
*/
GenomicLocationFacets.prototype.setCanvas= function() {
	console.log("[Facets] ");
};

/**
 * Get the class name.
*/
GenomicLocationFacets.prototype.getName= function() {
	return this.myname;
};
