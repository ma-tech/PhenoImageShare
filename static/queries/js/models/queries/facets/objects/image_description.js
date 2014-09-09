function ImageDescription() {
	this.myname = "ImageDescription";
};

/**
 * Register a canvas with this controller.
*/
ImageDescription.prototype.setName= function() {
	console.log("[ImageDescription] ");
};

/**
 * Get the class name.
*/
ImageDescription.prototype.getName= function() {
	return this.myname;
};
