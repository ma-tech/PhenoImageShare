function DataStructure(text, tags, selectable, nodes, id, endnode, state) {
    this.text = text;
    this.selectable = selectable;
    this.nodes = nodes;
    this.endnode = endnode;
    this.state = state; 
	
	DataStructure.prototype = {
		setText: function(text) {
			this.text = text
		},
	}
}