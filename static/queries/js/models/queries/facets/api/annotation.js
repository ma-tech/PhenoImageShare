function Annotation() {
	this.myname = "Annotation";
};

/**
 * Register a canvas with this controller.
*/
Annotation.prototype.setName= function() {
	console.log("[Annotation] ");
};

/**
 * Get the class name.
*/
Annotation.prototype.getName= function() {
	return this.myname;
};
