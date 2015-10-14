(function(OSD, $) {
	
	if (!$.version || $.version.revision < 1) {
	        throw new Error('Ontology box requires Annotation Tool version 0.0.1+');
	}
	
    OSD.AnnotationTool.prototype.ontologies = function(options) {
	     if (!this.ontologyboxInstance) {
             options = options || {};
             options.annotationTool = this;
             this.ontologyControllerInstance = new $.OntologyController(options);
         } else {
             this.ontologyboxInstance.refresh(options);
         }
		 
		 return this.ontologyControllerInstance;
     };
	
	 OSD.AnnotationTool.prototype.getOntoglogyController = function() {
		 return this.ontologyControllerInstance;
	 };
		
  $.OntologyController = function(options) {
    
	options = options || {};
  
  	//Ontologies input components
    this.main_panel = options.main || "ontologies-panel";
	this.tabs_panel = options.tabs || "tabs-panel";
	this.ontology_inputId = options.ontology_input || "ontology-input";
	this.load_ontology_button = options.load_ontology_button || "load-ontology-button";
	this.clear_ontology_button = options.clear_ontology_button || "clear-ontology-button";
	this.tree_wrapperId = options.tree_wrapper || "tree-wrapper";
	this.tree_holderId = options.tree_holder || "tree-holder";
	this.ontologies_div = options.ontologies_div || "ontologies-div";
	this.add_ontology_term = options.add_ontology_term || "add-ontology-div";
	this.local_data = options.local_data || false;
	
	this.tree_wrapper = jQuery("#" + this.tree_wrapperId);
	this.ontology_input = jQuery("#" + this.ontology_inputId);
	this.tree_element = null;
	
	this.tree_holder = null;
	
	//annotation tool
	this.annotationTool = options.annotationTool;
	
	this.myname = "Ontologies Controller";
	
	this.tree_initialized = false;
	
	this.ontologies_elements_template = {
		div: '<div></div>',
		accordion: '<li class="list-group-item"></li>',
		button: '<button type="button"></button>',
		title_h3: '<h3 id="" class="panel-title" style="margin-top: 10px;padding: 0px;"></h3>',
		underline_div: '<div class="panel panel-primary" style="margin-bottom: 0px;padding: 0px;"></div>',
		link: '<a></a>'
	};
	
	this.bioportal_tree_config;
	
	//initialise ontologies contoller - setup events, etc.
	this.init();
	
  };
  
   $.OntologyController.prototype = {
   	
	   init: function(){
		   
		   this.bioportal_tree_config = this.getConfiguration();
		   this.setupEventHandlers();
			
		   console.log("["+this.myname + "]  Initialisation completed.");
		   return;
	   },
	   
	   //Setup input event handlers
	   setupEventHandlers: function (){
		   this.setupInputElements();
		   this.setupOntologyInput();
	   },
	   
	   setupInputElements: function(){
		   //setup handlers for ontology tool buttons
		  // this.ontology_input.on("click", jQuery.proxy(this.inputOntologyHandler, this));
		   this.ontology_input.on("select2:select", jQuery.proxy(this.loadOntologies, this));
		   this.ontology_input.on("select2:unselect", jQuery.proxy(this.loadOntologies, this)); 
		   //jQuery("#"+ this.load_ontology_button).on("click", jQuery.proxy(this.loadOntologies, this));
		   jQuery("#"+ this.clear_ontology_button).on("click", jQuery.proxy(this.clearOntologies, this));
		   
		   jQuery("#"+ this.add_ontology_term).on("click", jQuery.proxy(this.addSelectedTerms, this));
	   },
	   
	   setupOntologyInput: function(){
		    if(this.local_data == false)
		   	 this.addOntologyDataToInput();
	   },

	   addOntologyDataToInput: function(data){
		   
		   var self = this;
		   
		   if (data == undefined){
         		var url = self.bioportal_tree_config.ontologies_url;
         		var data = {'apikey': self.bioportal_tree_config.apikey};
         		var tree_data = [];
		
         		var request = jQuery.ajax({
         			  						method: "GET",
         		  							url: url,
         			  						data: data,
         									dataType:'json'
         								});
		
         		request.done(function( response ) {
         			var numberOfOntologies = response.length;
			
         			for (var i = 0 ; i < numberOfOntologies ; i ++){
         				var item = {};
         				item.id = i;
         				item.text = response[i].name + "(" + response[i].acronym + ")";
         				tree_data.push(item);
         				item.acronym = response[i].acronym;
         			}
			
         			//process response: populate selector with tree data
         			self.ontology_input.select2({
         	 			placeholder: "Type here to select ontologies",
         	 			allowClear: true,
         				data : tree_data,
         				templateSelection: self.formatOntologiesSelection
         				 //theme: "classic"
         			 });
           		})
		
         		//process ajax connectivity failure
         		request.fail(function( jqXHR, textStatus ) {
           		  console.log("Failed loading ontologies from Biorportal, Status = " + textStatus );
         	 	});
				
		   }else{
			  
    			this.ontology_input.select2({
    	 			placeholder: "Type here to select ontologies",
    	 			allowClear: true,
    				data : data,
    				templateSelection: self.formatOntologiesSelection
    				 //theme: "classic"
    			 });
				 
		   }
		   
      	  	//re-enable save button if previously disabled.
      		jQuery('#save_annotation').removeAttr('disabled');
	   },
	   
		addSymbolToInput: function(ontologyId){
 		   var data;
		   
 		   if (this.inputHasData() == true ){
 		   		data = this.getSelectedOntologies();
				
 				var ids = [];
				
 				for (id in data){
 					ids.push(id);
 				}
 				ids.push(ontologyId);
 				this.ontology_input.val(ids).trigger("select2:select");	
		
 		   }else{
 		   		jQuery("#ontology-input").val(ontologyId).trigger("select2:select");
 		   }
		},
		
 	   removeSymbolFromInput: function(ontologyId){
 		   if (this.inputHasData() == true ){
 		   		data = this.getSelectedOntologies();
				
 				var ids = [];
				
 				for (id in data){
					if(id != ontologyId)
 						ids.push(id);
 				}
 				this.ontology_input.val(ids).trigger("select2:select").trigger("change");	
		
 		   }
 	   },
	   
	   getSelectedOntologies: function(){
		   var data;
		   
		   if (this.inputHasData() == true){
		   		data = this.ontology_input.select2("data"); 
		   }else{
			   data = null;
		   }
		   
			return data;
	   },
		
	   inputHasData: function(){
		   var hasData = false;
		   
		   try{
				var data = this.ontology_input.select2("data"); 
				if (data.length > 0){
					hasData = true;
				}
					
		   }catch(err){
			   console.log(err);
		   		hasData = false
		   }
		   
		   return hasData;
	   },
	   
	   //load ontologies from bioportal
	   loadOntologies: function(){
		
		    var data = this.getSelectedOntologies();
			var ontologies_acronyms = [];
		
	   		for (key in data){
	   			ontologies_acronyms.push(data[key].acronym);
			}
			
	   		this.rebuildOntologyPanel(ontologies_acronyms);
	   },
	   
	   clearOntologies: function(){
		   this.ontology_input.val(null).trigger("select2:select").trigger("change");
		   this._removeTrees();
	   },

	   //Search bioportal for ontologies.
	   searchOntologies: function(symbol){
		   
	   },
	   
	   addSelectedMainTerms: function(node){
		   alert("Please select annotation type to add");
	   },
	   
	   addSelectedTerms: function(node){
		  
		 var selectedObjects;
	   
		  //get selected graphical objects
		 if (this.annotationTool.getActiveObjects() == null){
			selectedObjects = this.annotationTool.getActiveObject();
		 }else{
			 selectedObjects = this.annotationTool.getActiveObjects();
		 }

	    //retrieve tree as jstree
		var tree_ref = jQuery('#' + node.original.ontology).jstree(true);
	
		 //prepare annotation from selection
		var selected_items = tree_ref.get_selected(true);
		var textual_annotations = this.prepareAnnotationData(selected_items);	
		
		return [selectedObjects, textual_annotations];
		
	   },
	   
	   addSelectedAbnAnatomy: function(node){
		   var annotations =  this.addSelectedTerms(node);
			var markups = this.annotationTool.addTextAnnotations(annotations[0], annotations[1], "abn_anatomy");
	   },
	   addSelectedGEAnatomy: function(node){		
		    var annotations =  this.addSelectedTerms(node);
			var markups = this.annotationTool.addTextAnnotations(annotations[0], annotations[1], "ge_anatomy");
	   		
	   },
	   addSelectedDptAnatomy: function(node){		   
		    var annotations =  this.addSelectedTerms(node);
			var markups = this.annotationTool.addTextAnnotations(annotations[0], annotations[1], "dpt_anatomy");
	 	},
	   
	   addSelectedPhenotype: function(node){
		   var annotations =  this.addSelectedTerms(node);
    	   var markups = this.annotationTool.addTextAnnotations(annotations[0], annotations[1], "phenotype");
	   },
	   
	   prepareAnnotationData: function(selection){
		map = new Map();
		
		for (item in selection){
				var standardId = this.convertToStandardId(selection[item].id);
				map.set(standardId,selection[item].text);
		}
		
		return map;
		
	   },
	   
	   //function to perform a simple split of the id
	   convertToStandardId: function(id){
		 
		   var split1 = id.split("/");
		   var split2 = split1[split1.length - 1].split("_");
		 
		   var id = split2[0] + ':' + split2[1];
		   
		   return id;
	   },
	   
	   deleteSelectedTerms: function(node){
	   		//console.log(node);
	   },
	  
	   //Get ontologies backend configuration from server
	   getConfiguration: function(shape){
		   //TODO: extract configuration from GUI server backend.
			return {"data_url":"http://data.bioontology.org", "ontology":"NCIT","apikey":"8b5b7825-538d-40e0-9e9e-5ab9274a9aeb", "ontologies_url": "http://data.bioontology.org/ontologies/"};
	   },
	   
 	   formatOntologiesSelection: function(onto){
   			return onto.acronym;
   	   },
	
   		rebuildOntologyPanel: function(ontologies){
   			this._removeTrees();
   			this._renderTrees(ontologies);
   		},
		
		getDisplayedOntologyTrees: function(){
			if (this.tree_holder != null){
				return this.tree_holder.find( "div.jstree" );
			}else{
				return this.tree_holder;
			}
			
		},
		
		getDisplayedOntologyTreesAsJSTree: function(){
			var jstree_refs = [];
			var displayed_trees = this.getDisplayedOntologyTrees();
		
			for (var i = 0; i < displayed_trees.length; i++){
				jstree_refs.push(jQuery('#' + displayed_trees[i].id).jstree(true));
				console.log(displayed_trees[i]);
			}
			
			return jstree_refs;
		},
		
		getOntologyInput: function(){
			return this.ontology_input;
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
				self.tree_holder = jQuery(self.ontologies_elements_template.div).attr('id', 'tree-holder').attr('style','overflow:auto;');
				self.tree_initialized = true;
			}

			for (var i = 0 ; i < numOfOntologies ; i ++){
				var tree = self._buildTree(ontologyAcronyms[i]);
			
				//adding tree title
				self.tree_holder
					.append(jQuery(self.ontologies_elements_template.title_h3)
					.append(jQuery(self.ontologies_elements_template.link).html(ontologyAcronyms[i])))
					.append(jQuery(self.ontologies_elements_template.underline_div));
				
				//adding tree
				self.tree_holder.append(tree);
			}
			
			self.tree_wrapper.empty().append(self.tree_holder);
		},
		
		//build ontology tree for selected symbols
		_buildTree: function(acronym){
			//alert("got here");
			var self = this;
			
			var tree_element;
			
			self.bioportal_tree_config = this.getConfiguration();
			
			tree_element = jQuery(self.ontologies_elements_template.div).attr('id', acronym);
			
			tree_element.on('contextmenu', '.jstree-anchor', function (e) {
					/*
					console.log("Something done");
					var instance = tree_element.jstree(true);
					
					console.log(instance);
					/*
					if (!e.target.id){
						console.log("entity id does not exist");
						e.target.id='entity_anchor';
					}

					console.log(instance.get_node(e.target));
					console.log(e.target);
				*/
			});
				
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
										//node.id = collections[key]['prefLabel'];
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
					                	//node.id = data[key]['prefLabel'];
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
				                "label": "Add term(s)",
				                "action": function (obj) { 
				                    self.addSelectedMainTerms(node);
				                },
								"submenu": {
									"depicted_anatomy" : {
				 			  	  		  "separator_before": false,
				              	  		  "separator_after": false,
				             	   		 "label": "As Depicted Anatomy",
				              	  	     "action": function (obj) { 
				                  	  	 	self.addSelectedDptAnatomy(node);
				               	 		}
									},
									"ge_anatomy" : {
				 			  	  		  "separator_before": false,
				              	  		  "separator_after": false,
				             	   		 "label": "As GE Anatomy",
				              	  	     "action": function (obj) { 
				                  	  	 	self.addSelectedGEAnatomy(node);
				               	 		}
									},
									"abnormal_anatomy" : {
				 			  	  		  "separator_before": false,
				              	  		  "separator_after": false,
				             	   		 "label": "As Abnormal Anatomy",
				              	  	     "action": function (obj) { 
				                  	  	 	self.addSelectedAbnAnatomy(node);
				               	 		}
									},
									"phenotype_description" : {
				 			  	  		  "separator_before": false,
				              	  		  "separator_after": false,
				             	   		 "label": "As Phenotype ",
				              	  	     "action": function (obj) { 
				                  	  	 	self.addSelectedPhenotype(node);
				               	 		}
									},
							}
						},
							
							"Delete term":{
				 			   "separator_before": false,
				                "separator_after": false,
				                "label": "Delete term",
				                "action": function (obj) { 
				                 	self.deleteSelectedTerms(node);
								}
							}
						}
					}
				},
				"plugins" : [ "contextmenu", "checkbox" ],
			});
		
			return tree_element;
		},
	   
   };
    
}(OpenSeadragon, AnnotationTool));