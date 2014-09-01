function MutantGenotypeTrait() {
	this.myname = "MutantGenotypeTrait";
};

/**
 * Register a canvas with this controller.
*/
MutantGenotypeTrait.prototype.setName= function() {
	console.log("[MutantGenotypeTrait] ");
};

/**
 * Get the class name.
*/
MutantGenotypeTrait.prototype.getName= function() {
	return this.myname;
};
