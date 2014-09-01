function Expression() {
	this.myname = "Expression";
};

/**
 * Register a canvas with this controller.
*/
Expression.prototype.setName= function() {
	console.log("[Expression] ");
};

/**
 * Get the class name.
*/
Expression.prototype.getName= function() {
	return this.myname;
};
