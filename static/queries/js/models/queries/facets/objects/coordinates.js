function Coordinates() {
	this.myname = "Coordinates";
};

/**
 * Register a canvas with this controller.
*/
Coordinates.prototype.setName= function() {
	console.log("[Coordinates] ");
};

/**
 * Get the class name.
*/
Coordinates.prototype.getName= function() {
	return this.myname;
};
