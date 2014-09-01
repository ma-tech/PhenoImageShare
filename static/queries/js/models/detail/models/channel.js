function Channel() {
	this.myname = "Channel";
};

/**
 * Register a canvas with this controller.
*/
Channel.prototype.setName= function() {
	console.log("[Channel] ");
};

/**
 * Get the class name.
*/
Channel.prototype.getName= function() {
	return this.myname;
};
