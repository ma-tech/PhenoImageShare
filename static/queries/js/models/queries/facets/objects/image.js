function Image() {
	this.myname = "Image";
};

/**
 * Register a canvas with this controller.
*/
Image.prototype.setName= function() {
	console.log("[Image] ");
};

/**
 * Get the class name.
*/
Image.prototype.getName= function() {
	return this.myname;
};
