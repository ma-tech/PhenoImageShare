function DepictedExpression() {
	this.myname = "DepictedExpression";
};

/**
 * Register a canvas with this controller.
*/
DepictedExpression.prototype.setName= function() {
	console.log("[DepictedExpression] ");
};

/**
 * Get the class name.
*/
DepictedExpression.prototype.getName= function() {
	return this.myname;
};
