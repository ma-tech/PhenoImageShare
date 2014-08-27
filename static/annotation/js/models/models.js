function Line(x0, y0, x1, y1, draggable){
	this.type = "Line";
	this.points = [x0, y0, x1, y1];
	this.thickness = 20;
	this.color = "red";
	this.length = null;
	this.draggable = draggable;
	
	var points = this.points;
	var thickness = this.thickness;
	var color = this.color;
	var draggable = this.draggable;
	
	this.line = new Kinetic.Line({
	    points: points,
	    stroke: color,
	    strokeWidth: thickness,
		draggable: draggable
	});
	
	this.line.on('mouseover', function() {
	        document.body.style.cursor = 'pointer';
			console.log("[Arrow] Mouseover: ");
	});
	
    this.line.on('mouseout', function() {
           document.body.style.cursor = 'default';
    });
}

Line.prototype = {
	getPoints: function(){
		return this.line.points();
	},
	
	setPoints: function(points){
		return this.line.points(points);
	},

	getType: function(){
		return this.type;
	},
	
	getLineThickness: function(){
		return this.thickness;
	},
	
	getShape: function(){
		return this.line;
	},
	
	getLength: function(){
		return this.length;
	},
	
	getCenter: function(){
		return this.center;
	},
	
	getColor: function(){
		return this.color;
	},
	
	setColor: function(color){
		this.color = color;
	},
	
	getAnnotation: function(){
		
	},
	
	setAnnotation: function(){
		
	}
}

function Rectangle(x0, y0, draggable){
	this.type = "Rectangle";
	this.x0 = x0;
	this.y0 = y0;
	this.thickness = 10;
	this.color = "yellow";
	this.length = null;
	this.draggable = draggable;
	
	var points = this.points;
	var thickness = this.thickness;
	var color = this.color;
	var draggable = this.draggable;
	var x0 = this.x0;
	var y0 = this.y0;
	
    this.rect = new Kinetic.Rect({
        x: x0, 
        y: y0,
        stroke: color,
		strokeWidth: thickness,
		draggable: draggable
    });
	
	this.rect.on('mouseover', function() {
	        document.body.style.cursor = 'pointer';
			console.log("[Rectangle] Mouseover: ");
	});
	
    this.rect.on('mouseout', function() {
           document.body.style.cursor = 'default';
    });
		  
}

Rectangle.prototype = {
	getX: function(){
		return this.rect.x();
	},
	
	setX: function(x){
		return this.rect.x(x);
	},
	
	getY: function(points){
		return this.rect.y();
	},
	
	setY: function(y){
		return this.rect.y(y);
	},

	getType: function(){
		return this.type;
	},
	
	getLineThickness: function(){
		return this.thickness;
	},
	
	getShape: function(){
		return this.rect;
	},
	
	setWidth: function(width){
		return this.rect.width(width);
	},
	
	setHeight: function(height){
		return this.rect.height(height);
	},
	
	
	getHeight: function(){
		return this.rect.height();
	},
	
	
	getWeight: function(){
		return this.rect.width();
	},
	
	getCenter: function(){
		return this.center;
	},
	
	getColor: function(){
		return this.color;
	},
	
	setColor: function(color){
		this.color = color;
	},
	getAnnotation: function(){
		
	},
	
	setAnnotation: function(){
		
	}
}

function Circle(x0, y0, radius, draggable){
	this.type = "Circle";
	this.radius = radius;
	this.x0 = x0;
	this.y0 = y0;
	this.thickness = 8;
	this.color = "yellow";
	this.length = null;
	this.draggable = draggable;
	
	var x0 = this.x0;
	var y0 = this.y0;
	var thickness = this.thickness;
	var color = this.color;
	var draggable = this.draggable;
	
    this.circle = new Kinetic.Circle({
           x: x0,
           y: y0,
           radius: radius,
           stroke: color,
           strokeWidth: thickness,
		   draggable: draggable
     });
	 
 	this.circle.on('mouseover', function() {
 	        document.body.style.cursor = 'pointer';
 			console.log("[Circle] Mouseover: ");
 	});
	
     this.circle.on('mouseout', function() {
            document.body.style.cursor = 'default';
     });
	 
}

Circle.prototype = {
	getRadius: function(){
		return this.circle.radius();
	},
	setRadius: function(radius){
		return this.circle.radius(radius);
	},
	setX: function(x){
		this.circle.x(x);
	},
	
	setY: function(y){
		this.circle.y(y);
	},
	
	getX: function(){
		return this.circle.x();
	},
	
	getY: function(){
		return this.circle.y();
	},

	getType: function(){
		return this.type;
	},
	
	getLineThickness: function(){
		return this.thickness;
	},
	
	getShape: function(){
		return this.circle;
	},
	
	getArea: function(){
		return this.area;
	},
	
	getCenter: function(){
		return this.center;
	},
	
	getColor: function(){
		return this.color;
	},
	
	setColor: function(color){
		this.color = color;
	},
	
	getAnnotation: function(){
		
	},
	
	setAnnotation: function(){
		
	}
}