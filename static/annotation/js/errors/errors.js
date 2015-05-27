/**
 * Construct a new error handling object
 *
 * @param canvasId [string] the canvas DOM ID, e.g. 'drawingcanvas'
 * @param image:  URL to background (bottom) image displayed on canvas.
 */
function ErrorHandlers() {
	this.canvas = null;
	this.myname = "Error Handler";
	this.controllers = null;
	this.currentController = null;
	
	console.log("["+this.myname+"] Constructing " + this.myname);
};
