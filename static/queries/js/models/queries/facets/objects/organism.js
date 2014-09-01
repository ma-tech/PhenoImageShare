function Organism() {
	this.myname = "Organism";
};

/**
 * Register a canvas with this controller.
*/
Organism.prototype.setName= function() {
	console.log("[Organism] ");
};

/**
 * Get the class name.
*/
Organism.prototype.getName= function() {
	return this.myname;
};
