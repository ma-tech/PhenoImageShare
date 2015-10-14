function AnnotationTool(drawingController, db) {
	this.canvas = null;
	this.myname = "Annotation Tool";
	this.annotationURL = "";
	this.dbConnector = db;
	this.tree_wrapper = null;
	this.tree_initialised = false;
	this.tree_wrapper = $("#tree_wrapper");
	
	this._template = {
		div: '<div></div>',
		accordion: '<li class="list-group-item"></li>',
		button: '<button type="button"></button>',
		title_h3: '<h3 id="" class="panel-title" style="margin-top: 10px;padding: 0px;"></h3>',
		underline_div: '<div class="panel panel-primary" style="margin-bottom: 0px;padding: 0px;"></div>',
		link: '<a></a>'
	};
	
	this.add_freetext_btn = $('#add_freetext');
	this.save_annotation_btn = $('#save_annotation');
	this.drawingController = drawingController;
	this.selectedNodes = [];
	this.bioportal_tree_config = {};
	this.initialiseOntologyTrees();
	this.initialiseEventHandlers();
	this.initialiseDOMElements();
	
	console.log("["+this.myname+"] Initialising " + this.myname);
};


AnnotationTool.prototype = {
	addFreetextHandler: function(e){
		alert("saving objects to database");
	},
	
	setCanvas : function(canvas) {
		console.log("["+this.myname+ "] Registering Canvass: "+canvas.myname);
		this.canvas = canvas;
	},
	
	getCanvas : function() {
		return this.canvas;
	},
	
	setName : function(myame) {
		this.myname = myname;
	},
	
	getName : function() {
		return this.myname;
	},
	edit : function(annotation) {
	
	},
	setAnnotationAJAXURL : function(urls) {
		this.annotationURL = urls;
		//this.annotationPostURL = url;
	},
	
	initialiseOntologyTrees : function(){
		this.bioportal_tree_config = {"data_url":"http://data.bioontology.org", "ontology":"NCIT","apikey":"8b5b7825-538d-40e0-9e9e-5ab9274a9aeb", "ontologies_url": "http://data.bioontology.org/ontologies/"};
		
		var self = this;
		
		$('#ontologies_div').jstree({
			'core' : {
			  "check_callback" : true,
			  'data' : {
			    'url' : function (node) {
						if (node.id === '#'){
							return self.bioportal_tree_config.data_url + "/ontologies/" + self.bioportal_tree_config.ontology + "/classes/roots" ;
			       	 	
						}else{
							return node.original.children_tree;
						}
			    },
			    'data' : function (node) {
					return {'apikey': self.bioportal_tree_config.apikey };
			    },
			    converters:
			    {
			        "text json": function (jsonString)
			        {
			            var data = JSON.parse(jsonString);
						var treedata = [];
					
						if (data && data.hasOwnProperty('collection')){
							var numberOfCollections = data.collection.length;
							var collections = data.collection;
						
							for (key in collections){
								var node = {};
							
				            	if (collections[key].hasOwnProperty('@id') && collections[key].hasOwnProperty('prefLabel') ){
				                	node.id = collections[key]['@id'];
									node.text = collections[key]['prefLabel'];
									node.ontology = acronym;
									
									if(collections[key]['links']['children']){
										node.children_tree = collections[key]['links']['children'];
										node.children = true;
									}
	
									node.icon = false;
									node.tree = collections[key]['links']['tree'];
				            	}
							
								treedata.push(node);
							
								//console.log(collections[key]);
							}

						}else{
						
							for (key in data){
								var node = {};
							
				            	if (data[key].hasOwnProperty('@id') && data[key].hasOwnProperty('prefLabel')){
				                	node.id = data[key]['@id'];
									node.text = data[key]['prefLabel'];
									node.children_tree = data[key]['links']['children'];
									node.children = true;
									node.icon = false;
									node.ontology = acronym;
									node.tree = data[key]['links']['tree'];
									//data_entry.state = {selected: true}
				            	}
							
								treedata.push(node);
							
								//console.log(collections[key]);
							}
						}
					  
			            return treedata;
			        }
			    },			
			  }
			},
			"contextmenu":{
				select_node: false,
				"items": function(node){
					var tree = $.jstree.reference('#ontologies_div');
					
					return {
						"Add terms": {
			 			   "separator_before": false,
			                "separator_after": false,
			                "label": "Add terms",
			                "action": function (obj) { 
			                    self.addSelectedTerms(node);
			                }
						}
					}
				}
			},
			"plugins" : [ "contextmenu", "checkbox" ],
		});
		
	},
	
	initialiseEventHandlers : function(){
		this.add_freetext_btn.on('click', $.proxy(this.addFreetextHandler, this)); 
		this.save_annotation_btn.on('click', $.proxy(this.updateAnnotation, this)); 
		$("#add_ontology_term").on('click', $.proxy(this.addSelectedTerms, this));
		$("#load_selected_ontologies").on('click', $.proxy(this.loadSelectedOntologies, this));
	},
	
	initialiseDOMElements: function(){
		var self = this;
		var ontologies_url = self.bioportal_tree_config.ontologies_url;
		var ontologies_request_data = {'apikey': self.bioportal_tree_config.apikey};
		var tree_data = [];
		
		var ontologies_request = $.ajax({
			  						method: "GET",
		  							url: ontologies_url,
			  						data: ontologies_request_data,
									dataType:'json'
								});
		
		ontologies_request.done(function( response ) {
			var numberOfOntologies = response.length;
			
			for (var i = 0 ; i < numberOfOntologies ; i ++){
				var item = {};
				item.id = i;
				item.text = response[i].name + "(" + response[i].acronym + ")";
				tree_data.push(item);
				item.acronym = response[i].acronym;
			}
			
			//process response: populate selector with tree data
			$(".ontology-selector").select2({
	 			placeholder: "Type here to select ontologies",
	 			allowClear: true,
				data : tree_data,
				templateSelection: self.formatOntologiesSelection
				 //theme: "classic"
			 });
  		})
		
		//process ajax connectivity failure
		ontologies_request.fail(function( jqXHR, textStatus ) {
  		  console.log( );
	 	});
		
		console.log(tree_data);
	  
	  	//re-enable save button if previously disabled.
		$('#save_annotation').removeAttr('disabled');
		 
	},
	
	loadSelectedOntologies: function(event){
		var data = $(".ontology-selector").select2("data"); 
		delete data.element; 
		//var ontologies = JSON.stringify(data);
		var ontologies_acronyms = [];
		
		for (key in data){
			ontologies_acronyms.push(data[key].acronym);
		}
		
		this.rebuildOntologyPanel(ontologies_acronyms);
	},
	
	rebuildOntologyPanel: function(ontologies){
		this._removeTrees();
		this._renderTrees(ontologies);
	},
	
	_removeTrees: function() {

		if (this.tree_initialized) {
			this.tree_holder.remove();
			this.tree_holder = null;
		}
		this.tree_initialized = false;
	},
	
	_renderTrees: function(ontologyAcronyms) {

		var self = this;
		var numOfOntologies = ontologyAcronyms.length;

		if (!self.tree_initialized) {
			self.tree_holder = $(self._template.div).attr('id', 'tree_holder').attr('style','overflow:auto;');
			self.tree_initialized = true;
		}

		for (var i = 0 ; i < numOfOntologies ; i ++){
			var tree = self._buildTree(ontologyAcronyms[i]);
			
			//adding tree title
			self.tree_holder
				.append($(self._template.title_h3)
				.append($(self._template.link).html(ontologyAcronyms[i])))
				.append($(self._template.underline_div));
				
			//adding tree
			self.tree_holder.append(tree);
		}
		
		self.tree_wrapper.empty().append(self.tree_holder);
		
	},
	
	_buildTree: function(acronym){
		
		var self = this;
		self.bioportal_tree_config = {"data_url":"http://data.bioontology.org", "ontology":"NCIT","apikey":"8b5b7825-538d-40e0-9e9e-5ab9274a9aeb", "ontologies_url": "http://data.bioontology.org/ontologies/"};
		var tree_element = $(self._template.div).attr('id', acronym);
		
		
		tree_element.jstree({
			  'core' : {
			  "check_callback" : true,
			  'data' : {
			    'url' : function (node) {
						if (node.id === '#'){
							return self.bioportal_tree_config.data_url + "/ontologies/" + acronym + "/classes/roots" ;
			       	 	
						}else{
							return node.original.children_tree;
						}
			    },
			    'data' : function (node) {
					return {'apikey': self.bioportal_tree_config.apikey };
			    },
				
			    converters:
			    {
			        "text json": function (jsonString)
			        {
			            var data = JSON.parse(jsonString);
						var treedata = [];
					
						if (data && data.hasOwnProperty('collection')){
							var numberOfCollections = data.collection.length;
							var collections = data.collection;
						
							for (key in collections){
								var node = {};
							
				            	if (collections[key].hasOwnProperty('@id') && collections[key].hasOwnProperty('prefLabel') ){
				                	node.id = collections[key]['@id'];
									node.text = collections[key]['prefLabel'];
									node.ontology = acronym;
								
									if(collections[key]['links']['children']){
										node.children_tree = collections[key]['links']['children'];
										node.children = true;
									}
	
									node.icon = false;
									node.tree = collections[key]['links']['tree'];
				            	}
							
								treedata.push(node);
							
								//console.log(collections[key]);
							}

						}else{
						
							for (key in data){
								var node = {};
							
				            	if (data[key].hasOwnProperty('@id') && data[key].hasOwnProperty('prefLabel')){
				                	node.id = data[key]['@id'];
									node.text = data[key]['prefLabel'];
									node.children_tree = data[key]['links']['children'];
									node.children = true;
									node.icon = false;
									node.ontology = acronym;
									node.tree = data[key]['links']['tree'];
									//data_entry.state = {selected: true}
				            	}
							
								treedata.push(node);
							
								//console.log(collections[key]);
							}
						}
					  
			            return treedata;
			        }
			    },			
			  }
			},
			"contextmenu":{
				select_node: false,
				"items": function(node){
					//var tree = $.jstree.reference('#'+node.original.ontology);
					
					return {
						"Add terms": {
			 			   "separator_before": false,
			                "separator_after": false,
			                "label": "Add terms",
			                "action": function (obj) { 
								console.log(obj);
			                    self.addSelectedTerms(node);
			                }
						}
					}
				}
			},
			"plugins" : [ "contextmenu", "checkbox" ],
		});
		
		return tree_element;
	},
	
	formatOntologies: function(onto){
		
		if (onto.loading) return onto.text;
		
		var markup = '<div class="clearfix">' +
		 '<div class="col-sm-6">' + onto['acronym'] + '</div>' +
		'<div class="col-sm-6">' + onto['name'] + '</div>' +
		'<div class="col-sm-6"> Bioportal</div>' +
		'</div>';	
		
	     return markup;
		 
	},
	
	formatOntologiesSelection: function(onto){
		return onto.acronym;
	},
	
	addSelectedTerms: function(node){
		console.log(node);
		this.selectedNodes = $.jstree.reference('#'+node.original.ontology).get_selected(true); //$.jstree.reference('#ontologies_div').get_selected(true);
		this.selectedTerms = this.getSelectedTerms(this.selectedNodes);

		this.selectedObjects = this.getSelectedObjects();
		
		if(this.selectedObjects.length == 0){
			console.log("["+this.myname+ "] No object selected");
			return ; 
			//$("#info_panel").text("No object selected. Please select object to add annotations to");
		}
		
		for (var i = 0 ; i < this.selectedObjects.length; i++){
			for (key in this.selectedTerms){
				var dptAnatomy = new Object();
				dptAnatomy.term = this.selectedTerms[key];
				dptAnatomy.id = "EMAP:3144"; //this.selectedTerm;
				this.selectedObjects[i].addDptAnatomy(dptAnatomy);
				console.log("["+this.myname+ "] Adding "+ dptAnatomy.term  + " to selected object " + this.selectedObjects[i].getName());
				
			}
		}
		
		var alertStatus = {};
		alertStatus.message = "";
		
		this.popAlert("OK");
		
		//this.save_annotation_btn.attr('disabled','disabled');
	},
	
	getSelectedTerms: function(nodes){
		var terms = [];
		
		for (key in nodes){
			terms.push(nodes[key].text);
		}
		
		return terms;
	},
	
	popAlert : function(alertStatus) {
  
	    if (alertStatus == "OK"){
	  	  $('<div/>').qtip({
	  	          content: {
	  	              text: "Added term successfully",
	  	              title: {
	  	                  text: 'Attention!',
	  	                  button: false
	  	              }
	  	          },
	  	          position: {
	  	              target: [0,0],
	  	              container: $('#ontology-term-added-div')
	  	          },
	  	          show: {
	  	              event: false,
	  	              ready: true,
	  	              effect: function() {
	  	                  $(this).stop(0, 1).animate({ height: 'toggle' }, 400, 'swing');
	  	              },
	  	              delay: 10,
	  	              //persistent: "persistent"
				  
	  	          },
	  	          hide: {
	  	              event: false,
	  	              effect: function(api) {
	  	                  $(this).stop(0, 1).animate({ height: 'toggle' }, 400, 'swing');
	  	              }
	  	          },
	    			style:{
	    				classes:"jgrowl qtip-green",
	    				width: 300, 
	  					tip:false
	    			}
	  	         /* style: {
	  		
	  	              width: 250,
	  	              classes: 'jgrowl',
	  	              tip: false
	  	          }*/
	  				 ,
	  	          events: {
	  	              render: function(event, api) {
	  	                  if(!api.options.show.persistent) {
	  	                      $(this).bind('mouseover mouseout', function(e) {
	  	                          var lifespan = 5000;

	  	                          clearTimeout(api.timer);
	  	                          if (e.type != 'mouseover') {
	  	                              api.timer = setTimeout(function() { api.hide(e) }, lifespan);
	  	                          }
	  	                      })
	  	                      .triggerHandler('mouseout');
	  	                  }
	  	              }
	  	          }
	  	      });
	    }
	},
	
	getSelectedObjects: function(){
		var numObjs = this.drawingController.models.length;	
		var selectedObjs = new Array();
		
		for (var i = 0 ; i < numObjs ; i++){
			if (this.drawingController.models[i].getShape().stroke() == 'blue'){
				selectedObjs.push(this.drawingController.models[i]);
			}
		}
		
		return selectedObjs;
	},
	
	updateAnnotation : function() {
		console.log("["+this.myname+ "] Updating image annotation.");
		var phisid = "PhISId";
		var query = {};
		
		for (var i = 0 ; i < this.drawingController.models.length ; i++){
			if (this.drawingController.models[i].getStatus() == "new"){
				
				var description = "testing ISS from GUI, name is " + this.drawingController.models[i].getName();
				
				query.action = 'create';
				query.creatorid = 'solomon.adebayo@igmm.ed.ac.uk';
				query.imageid = this.canvas.imageId;
				query.description = description;
				
				var dptAnatomy = this.drawingController.models[i].getDptAnatomy();
				
				var dpt_anatomy_terms = [];
				var dpt_anatomy_ids = [];
				
				for (key in dptAnatomy){
					if(key != "freetext"){
						dpt_anatomy_terms.push(dptAnatomy[key].term)
						dpt_anatomy_ids.push(dptAnatomy[key].id);
					}
				
				}
				
				query.dpt_anatomyids = dpt_anatomy_ids;
				query.dpt_anatomy_terms = dpt_anatomy_terms;
				
				var x1 = this.drawingController.models[i].getShape().x();
				var y1 = this.drawingController.models[i].getShape().y();
				var dimRoi = [this.drawingController.models[i].getShape().width(), this.drawingController.models[i].getShape().height()];
				var dimImg = this.dbConnector.imageDimensions;
				
				var relative_coord = this.convertPointsToPercentages(x1, y1, dimRoi, dimImg);
				
				query.x_value = relative_coord[0];
				query.y_value = relative_coord[1];
				query.z_value = [0,0];
				
				this.addAnnotation(this.annotationURL.add, query);
				
			}else if (this.drawingController.models[i].getStatus() == "updated"){
				
			}else{
				
			}
			
		}
	
	this.save_annotation_btn.attr('disabled','disabled');
	
	},
	
	convertPointsToPercentages : function(x1, y1, dimRoi, dimImg){
		var x2 = x1 + dimRoi[0];
		var y2 = y1 + dimRoi[1];
		
		var Xrel1 = (x1 * 100) / dimImg[0];
		var Xrel2 = (x2 * 100) / dimImg[0];
		
		var Yrel1 = (y1 * 100) / dimImg[1];
		var Yrel2 = (y2 * 100) / dimImg[1];
		
		var x_values = [Xrel1,Xrel2];
		var y_values = [Yrel1,Yrel2] ;
		
		return [ x_values, y_values ];
	},
	
	addAnnotation : function(url, query) {
		//this is a workaround
		//var hwuURL = "http://lxbisel.macs.hw.ac.uk:8080/ISS/Annotation";
		/*var annotation_data ={};
	
		annotation_data.name = $("#ann_name").val(); //get name from appropriate field on modal box.
		annotation_data.description = $("#ann_desc").val(); //get name from appropriate field on modal box.
		annotation_data.freetext = $("#ann_freetext").val(); //get name from appropriate field on modal box.
	
		this.resetFields();
	
		data = JSON.stringify(annotation_data);
	
		var csrftoken = $.cookie('csrftoken');
		*/
		
		var csrftoken = $.cookie('csrftoken');
		
		console.log("Number of x_values = " + query.x_value.length);
		console.log("Number of y_values = " + query.y_value.length);
		console.log("Number of z_values = " + query.z_value.length);
		console.log("Number of anatomy terms = " + query.dpt_anatomy_terms.length);
		
		console.log("[Annodation Tool] Adding annotation to image, posting  data: " + data + ", with CSRF token: "+csrftoken);
	
		var annotationQuery = this.constructQuery(query);
		
		delete query.x_value;
		delete query.y_value;
		delete query.z_value;
		delete query.dpt_anatomy_terms;
		delete query.dpt_anatomyids;
		
		console.log(query);
		console.log(annotationQuery);
		
		
		var data = JSON.stringify(query);
		console.log(data);
		
		
		$.ajaxSetup({
		    beforeSend: function(xhr, settings) {
		           xhr.setRequestHeader("X-CSRFToken", csrftoken);
		   }
		});
	
		var annotation_request = $.ajax({
			  						method: "POST",
		  							url: url + "?" + annotationQuery,
			  						data: data,
									//crossdomain: true,
									dataType:'json',
									//traditional:true
								});
		
		annotation_request.done(function( response ) {
   		 	console.log(response);
  		});
		
		annotation_request.fail(function( jqXHR, textStatus ) {
  		  console.log(textStatus );
	  });
		
		/*
		$.post(url, data, function(response) {
		    // Post data collected from the modal box to server.
			console.log(response);
			console.log("[Annotation Tool] Response from Server: "+ response.message.status + " message = " + response.message.message);
		}, 'json').fail( fu);
		*/
	
	},
	
	constructQuery: function(params){
		var annotationQueryString = "";
		
		if (params.x_value != undefined){
			annotationQueryString = annotationQueryString + 'x_value='+ params.x_value[0];
			
			for (var i = 1 ; i < params.x_value.length ; i++){
				annotationQueryString = annotationQueryString + '&x_value='+ params.x_value[i];
			}
		}
		
		if (params.y_value != undefined){
			for (var i = 0 ; i < params.y_value.length ; i++){
				annotationQueryString = annotationQueryString + '&y_value='+ params.y_value[i];
			}
		}
		
		if (params.z_value != undefined){
			for (var i = 0 ; i < params.z_value.length ; i++){
				annotationQueryString = annotationQueryString + '&z_value='+ params.z_value[i];
			}
		}
		
		if (params.dpt_anatomy_terms != undefined){
			for (var i = 0 ; i < params.dpt_anatomy_terms.length ; i++){
				annotationQueryString = annotationQueryString + '&dpt_anatomy_term='+ params.dpt_anatomy_terms[i];
			}
		}
		
		if (params.dpt_anatomyids != undefined){
			for (var i = 0 ; i < params.dpt_anatomyids.length ; i++){
				annotationQueryString = annotationQueryString + '&dpt_anatomyid='+ params.dpt_anatomyids[i];
			}
		}
		
		console.log(annotationQueryString);
		
		return annotationQueryString;
	},
	
	resetFields :function() {
		$("#ann_name").val("");
		$("#ann_desc").val("");
		$("#ann_freetext").val("");
	},
	
}

