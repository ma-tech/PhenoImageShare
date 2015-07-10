function Line(x0, y0, x1, y1, draggable){
	this.type = "Line";
	this.points = [x0, y0, x1, y1];
	this.thickness = 20;
	this.color = "red";
	this.length = null;
	this.draggable = draggable;
	this.selected = false;
	this.status = "";
	
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
		
	},
	setStatus: function(object_status){
		this.status = object_status;
	},
	
	getStatus: function(){
		return this.status;
	}

}

function Rectangle(x0, y0, draggable, id){
	this.type = "rectangle";
	this.id = id;
	this.x0 = x0;
	this.y0 = y0;
	this.thickness = 2;
	this.color = "yellow";
	this.length = null;
	this.draggable = draggable;
	this.status = "";
	this.selected = false;
	this.imageId = "";
	
	this.abnAnatomyObjs = new Array();
	this.geAnatomyObjs = new Array();
	this.dptAnatomyObjs = new Array();
	
	this.phenotypeObjs = new Array();
	
	var points = this.points;
	var thickness = this.thickness;
	var color = this.color;
	var draggable = this.draggable;
	var x0 = this.x0;
	var y0 = this.y0;
	var myname = this.type + this.id;
	
    this.rect = new Kinetic.Rect({
        x: x0, 
        y: y0,
        stroke: color,
		strokeWidth: thickness,
		draggable: draggable
    });

/*	
	this.rect.on('mouseover', function() {
	        document.body.style.cursor = 'pointer';
			console.log("[Rectangle] Mouseover: ");
	});
	
    this.rect.on('mouseout', function() {
           document.body.style.cursor = 'default';
    });
	
    this.rect.on('mouseover mousedown mouseup', function() {
           console.log('Passing over');
    });

    this.rect.on('dblclick', function() {
           alert('I\m selected:' + myname);
    });
		  
	*/
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
	
	getName: function(){
		
		return this.type+this.id;
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
		
	},
	
	setSelected: function(boolean){
		this.selected = boolean;
	},
	
	getSelected: function(){
		return this.selected ? "selected" : "not selected" ;
	},

	setStatus: function(object_status){
		this.status = object_status;
	},
	
	getStatus: function(){
		return this.status;
	},
	
	setImageId: function(imageId){
		this.imageId = imageId;
	},
	getImageId: function(){
		return this.imageId;
	},
	
	addDptAnatomy: function(dptAnatomyObj){
		this.dptAnatomyObjs.push(dptAnatomyObj);
	},
	
	addGeAnatomy: function(geAnatomyObj){
		this.geAnatomyObjs.push(geAnatomyObj);
	},
	
	addAbnAnatomy: function(abnAnatomyObj){
		this.abnAnatomyObjs.push(abnAnatomyObj);
	},
	
	addPhenotype: function(phenotypeObj){
		return this.phenotypeObjs.push(phenotypeObj);
	},
	
	getPhenotype: function(){
		return this.phenotypeObjs;
	},
	
	getAbnAnatomy: function(){
		return this.abnAnatomyObjs;
	},
	
	getGeAnatomy: function(){
		return this.geAnatomyObjs;
	},
	
	getDptAnatomy: function(){
		return this.dptAnatomyObjs;
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


function Point(x0, y0, draggable, id){
	this.type = "point";
	this.id = id;
	this.x0 = x0;
	this.y0 = y0;
	this.thickness = 1;
	this.color = "yellow";
	this.length = null;
	this.draggable = draggable;
	this.status = "";
	this.selected = false;
	this.imageId = "";
	
	this.abnAnatomyObjs = new Array();
	this.geAnatomyObjs = new Array();
	this.dptAnatomyObjs = new Array();
	
	this.phenotypeObjs = new Array();
	
	var points = this.points;
	var thickness = this.thickness;
	var color = this.color;
	var draggable = this.draggable;
	var x0 = this.x0;
	var y0 = this.y0;
	var myname = this.type + this.id;
	
	/*
	var point = new Kinetic.Shape({
	    drawFunc: function(canvas){
	        context=canvas.getContext("2d");
	        context.save();
	        context.beginPath();
	        context.rect(0,0,96,96);
	        context.fillStyle="green";
	        context.fill();
	        context.globalCompositeOperation="destination-out";
	        drawStar(context,45,50,5,40,15);
	        canvas.fillStroke(this);
	        context.restore();
	    },
	    width: 96,
	    height: 96,
	    fill: 'green',
	    stroke: 'black',
	    strokeWidth: 2
	});
		*/

    this.point = new Kinetic.Rect({
        x: x0, 
        y: y0,
        stroke: color,
		strokeWidth: thickness,
		draggable: draggable
    });


/*	
	this.rect.on('mouseover', function() {
	        document.body.style.cursor = 'pointer';
			console.log("[Rectangle] Mouseover: ");
	});
	
    this.rect.on('mouseout', function() {
           document.body.style.cursor = 'default';
    });
	
    this.rect.on('mouseover mousedown mouseup', function() {
           console.log('Passing over');
    });

    this.rect.on('dblclick', function() {
           alert('I\m selected:' + myname);
    });
		  
	*/
}

Point.prototype = {
	getX: function(){
		return this.point.x();
	},
	
	setX: function(x){
		return this.point.x(x);
	},
	
	getY: function(points){
		return this.point.y();
	},
	
	setY: function(y){
		return this.point.y(y);
	},

	getType: function(){
		return this.type;
	},
	
	getLineThickness: function(){
		return this.thickness;
	},
	
	getShape: function(){
		return this.point;
	},
	
	getName: function(){
		
		return this.type+this.id;
	},
	
	setWidth: function(width){
		return this.point.width(width);
	},
	
	setHeight: function(height){
		return this.point.height(height);
	},
	
	
	getHeight: function(){
		return this.point.height();
	},
	
	
	getWeight: function(){
		return this.point.width();
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
		
	},
	
	setSelected: function(boolean){
		this.selected = boolean;
	},
	
	getSelected: function(){
		return this.selected ? "selected" : "not selected" ;
	},

	setStatus: function(object_status){
		this.status = object_status;
	},
	
	getStatus: function(){
		return this.status;
	},
	
	setImageId: function(imageId){
		this.imageId = imageId;
	},
	getImageId: function(){
		return this.imageId;
	},
	
	addDptAnatomy: function(dptAnatomyObj){
		this.dptAnatomyObjs.push(dptAnatomyObj);
	},
	
	addGeAnatomy: function(geAnatomyObj){
		this.geAnatomyObjs.push(geAnatomyObj);
	},
	
	addAbnAnatomy: function(abnAnatomyObj){
		this.abnAnatomyObjs.push(abnAnatomyObj);
	},
	
	addPhenotype: function(phenotypeObj){
		return this.phenotypeObjs.push(phenotypeObj);
	},
	
	getPhenotype: function(){
		return this.phenotypeObjs;
	},
	
	getAbnAnatomy: function(){
		return this.abnAnatomyObjs;
	},
	
	getGeAnatomy: function(){
		return this.geAnatomyObjs;
	},
	
	getDptAnatomy: function(){
		return this.dptAnatomyObjs;
	}
}
	