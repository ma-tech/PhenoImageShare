	function Point(x, y){
		this.x = x || 0;
		this.y = y || 0;
		this.type = "point";
		this.thickness = 2;
	}
	
	Point.prototype = {
		value: function(){
			return [this.x, this.y];
		},	
		getType: function(){
			return this.type;
		},
		getThickness: function(){
			return this.thickness;
		}
	}
	
	function Rectangle(x1, y1, x2, y2){
		this.x1 = x1 || 0;
		this.y1 = y1 || 0;
		this.x2 = x2 || 0;
		this.y2 = y2 || 0;
		
		this.type = "rectangle";
		this.thickness = 2;
	}
	
	Rectangle.prototype = {
		value: function(){
			return [this.x, this.y];
		},	
		getType: function(){
			return this.type;
		},
		getDiagonal: function(){
			return this.type;
		},
		getPoints: function(){
			return this.type;
		},
		getLength: function(){
			return this.type;
		},
		getWidth: function(){
			return this.type;
		},
		getCenter: function(){
			return this.type;
		}
		
	}
	
	