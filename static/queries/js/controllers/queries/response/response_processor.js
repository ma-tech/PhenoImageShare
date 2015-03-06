function Processor() {
	this.detail_base_url;
	this.searchString = "";
	this.params;
	this.query;
	this.historySet = [];
	this.imaging_method_label_storage = {};
};

/**
 * Register a canvas with this controller.
*/
Processor.prototype.setBaseURL= function(baseURL) {
	this.detail_base_url = baseURL;
};

/**
 * Set source URL.
*/
Processor.prototype.setSourceURL= function(sourceURL) {
	this.source_url = sourceURL;
};

/**
 * Set data loading waiter gif.
*/
Processor.prototype.setLoaderURL= function(waiterURL) {
	this.loading_waiter_url = waiterURL;
};

/**
 * Register a canvas with this controller.
*/
Processor.prototype.setQueryURL= function(queryURL) {
	this.query_base_url = queryURL;
};

Processor.prototype.setAutosuggestURL= function(autosuggestURL) {
	this.autosuggest_url = autosuggestURL;
};

Processor.setParams= function(params) {
	this.params = params;
};

Processor.getParams= function() {
	return this.params;
};

Processor.prototype.searchString = function() {
	return this.searchString;
};

Processor.prototype.queryHistoryBuilder = function(comp_que, query) {
	var historyEntry = {"query": comp_que, "url": query};
	this.historySet.push(historyEntry);
};

Processor.prototype.setQuery = function(query) {
	this.defaultQuery = query;
};

Processor.prototype.buildIQSQuery = function(query) {
	var iQSQuery = {};
	//query = { sampleType:"WILD_TYPE", imageType:"EXPRESSION", imagingMethod:"macroscopy" };
	
	if(query.sampleType)
		iQSQuery.sampleType = query.sampleType
	if(query.imageType)
		iQSQuery.imageType = query.imageType
	if (query.imagingMethod.value)
		iQSQuery.imagingMethod = query.imagingMethod.value
	if (query.stage.value)
		iQSQuery.stage = query.stage.value
	if(query.Anatomy.value)
		iQSQuery.anatomy = query.Anatomy.value
	if(query.Gene.value)
		iQSQuery.gene = query.Gene.value
	if(query.taxon.value)
		iQSQuery.taxon = query.taxon.value
	if(query.Phenotype.value)
		iQSQuery.phenotype = query.Phenotype.value
		
	return iQSQuery;
};

Processor.prototype.loadJSON = function(){
	var queryParams = '';
	var tableData = [];
	var galleryData = [];
	var params = Processor.getParams();
	var searchString = "";
	
	if ($("#searchInput").val() != undefined && $("#searchInput").val() !=""){
		this.searchString = $("#searchInput").val();
		searchString = this.searchString;
		console.log("Im here");
	}

	//var searchString = (this.defaultQuery != undefined && this.defaultQuery.term != undefined ? this.defaultQuery.term [0]	: this.searchString);
	//$("#searchInput").val((this.defaultQuery != undefined && this.defaultQuery.term != undefined ? this.defaultQuery.term [0]	: this.searchString));
	
	var detail_base_url = this.detail_base_url;
	var query_base_url = this.query_base_url;
	var autosuggest_url = this.autosuggest_url;
	var static_urls = {"loader_url":this.loading_waiter_url};
	
	var get_facets_data = this.getFacetsData;
	var single_level_facets_callback = this.singleLevels;
	
	var create_gallery = this.createGallery;
	
	var facet_data = "";

	var historydata = this.historySet;

	var facets_initialized = this.facets_initialized;
	
	if (this.query == undefined){
		this.query = {"term":(this.defaultQuery != undefined && this.defaultQuery.term != undefined ? this.defaultQuery.term [0]	: this.searchString), 
						"sampleType":(this.defaultQuery != undefined && this.defaultQuery.sampleType != undefined? this.defaultQuery.sampleType [0]	: ""), 
						"imageType":(this.defaultQuery != undefined && this.defaultQuery.imageType != undefined? this.defaultQuery.imageType [0]	: ""), 
						"stage":{"expanded": false, "value":(this.defaultQuery != undefined && this.defaultQuery.stage != undefined ? this.defaultQuery.stage[0]: "")}, 
						"imagingMethod":{"expanded": false, "value":(this.defaultQuery != undefined && this.defaultQuery.imagingMethod != undefined? this.defaultQuery.imagingMethod[0]: "")},
			 			"Phenotype":{"expanded": false, "value":(this.defaultQuery != undefined && this.defaultQuery.phenotype != undefined? this.defaultQuery.phenotype[0]: "")},
						"Anatomy":{"expanded": false, "value":(this.defaultQuery != undefined && this.defaultQuery.anatomy != undefined? this.defaultQuery.anatomy[0]: "")},
						"Gene":{"expanded": false, "value":(this.defaultQuery != undefined && this.defaultQuery.gene != undefined? this.defaultQuery.gene[0]: "")},
						"expressedFeature":(this.defaultQuery != undefined && this.defaultQuery.expressedFeature != undefined? this.defaultQuery.expressedFeature[0]: ""), 
						"sex":(this.defaultQuery != undefined && this.defaultQuery.sex != undefined? this.defaultQuery.sex[0]: ""), 
						"taxon":{"expanded": false, "value":(this.defaultQuery != undefined && this.defaultQuery.taxon != undefined? this.defaultQuery.taxon[0]: "")},
						"samplePreparation":(this.defaultQuery != undefined && this.defaultQuery.samplePreparation != undefined? this.defaultQuery.samplePreparation[0]: ""),
						"num":(this.defaultQuery != undefined && this.defaultQuery.num != undefined? this.defaultQuery.num[0]: ""),
						"start":(this.defaultQuery != undefined && this.defaultQuery.start != undefined? this.defaultQuery.start[0]: ""),
						"data":false,
						"expanded":{"Wildtype":false, "Imaging Method":false,"Mutants":false,"Stage":false,"Taxon":false}};
						
						queryParams = this.buildIQSQuery(this.query);
	}else {
		if (params){
			this.query = $.extend(true, this.query, params.query);
			queryParams = this.buildIQSQuery(this.query);
		}
	}
	
	var query = this.query;
	var queryString = (queryParams ? $.param(queryParams): "");
	
	var displayQuery = this.source_url+query_base_url+"?term="+searchString+"&"+queryString;
	
	//Sample competency question for demo (BSA section meeting)
	var comp_que = "[Competency question corresponding to query / semantic reasoning]";
	
	this.queryHistoryBuilder(comp_que, displayQuery);
	 
	//$.blockUI(); 
	 
	$.getJSON(query_base_url+"getImages?q="+searchString,queryParams,
 	   function(data, textStatus, jqXHR)
 	   {
		   tableTitle.innerHTML=data.response.numFound +" records found in database";
 		  
		   $.unblockUI();
		   
		   var numDocs = data.response.docs.length;
		   for (var i = 0; i < numDocs; i++) {
		      
			   id = data.response.docs[i].id; //capture image id.
			   expression = data.response.docs[i].expression_in_label_bag ? data.response.docs[i].expression_in_label_bag : " None " ; //capture expression for description.
			   anatomy = data.response.docs[i].anatomy_term ? data.response.docs[i].anatomy_term : " None ";
			   phenotype = data.response.docs[i].phenotype_label_bag ? data.response.docs[i].phenotype_label_bag : " None " ;
			   gene = data.response.docs[i].gene_symbol ? data.response.docs[i].gene_symbol : " None ";
			   
			   image_url = data.response.docs[i].image_url;
			   image_query_string = searchString;
			   
			   detail_url = detail_base_url + "?q="+searchString+"&img="+image_url;
				
			   image_hyperlink = "<a href="+encodeURI(detail_url)+" data-toggle=\"tooltip\" title="+ id +">";
			   
			   image = "<img src="+image_url+" style=\"width: 50%;\"/> </a>";
			   
			   image_with_hyperlink =  image_hyperlink + "<img src="+image_url+" style=\"width: 100%;\"/> </a>";
			   
			   descr = "<b> Expression: </b>" + expression + ", <b> Anatomy: </b>" + anatomy + ", <b> Phenotype: </b>"  + phenotype + ", <b> Gene: </b>" + gene; //+ ", <b> ID: </b>" +  id;
			   
			   tableData[i]=[image_with_hyperlink, descr];
			   galleryData[i] = [image, image_url, descr]
		   }
	
		   data['query'] = query;
		   
		   //fetch facets data from response.
		   facet_data = get_facets_data(data, single_level_facets_callback, static_urls);
		   
			//add data to gallery
		   create_gallery(galleryData);
		   
			//Add data to table.
   		$("#imgtable").dataTable().fnDestroy();
   		$('#imgtable').DataTable({
   			//"ajax": "get_images",
	       	"data": tableData,
   		 	"columns": [
   		       	{ "title": 'Image' },
   				{ "title": 'Description' }
   		  	  ],
			  "columnDefs": [
			    { "width": "20%", "targets": 0}
			  
		      ],
			  
			  scrollY: 900,
			  pageLength: 20,
   		 });	
		   
		   // Add data to facet.
		 $('#facets').treeview({
 	   		data: facet_data,
 	   		showTags: true,
			detail_page_url: detail_base_url,
			query_page_url: query_base_url,
			autosuggest_url: autosuggest_url,
	 	    onNodeSelected: function(event, node) {
				Processor.prepareParams(node, static_urls.loader_url);
	 	   	}
   	   	});
	
		//build some data
		$('#query_history').historic({
			data: historydata
		});

       });	   
	
};

Processor.prepareParams= function(node, loader_url) {
	var query = query;
	var params = {};
	params.query = node.query;
	
	Processor.setParams(params);
	
	//block the UI while loading data from server: TODO: Please remove hardcoding of this URL with a better approach. It's a very bad hack. Implement for technique to send loader_url to tagsinput.
	$.blockUI({ message: '<h1>Loading...<img src="'+loader_url+'"/></h1>'});

	loadJSON();
};

Processor.prototype.createGallery = function(galleryData) {
	
	var galleryCount = galleryData.length;
	var wrapper = $(template.list);
	
	$('#gridresults').empty().append(wrapper);
	
	for (var i = 0; i < galleryCount; i++ ){
		wrapper.append(
			$(template.imageitem)
			.append($(template.imagelink).attr('data-largesrc',galleryData[i][1]).attr('data-title', "Some title").attr('data-description',galleryData[i][2])
			.append($(galleryData[i][0])))
		)
	}
	
	Grid.init();
};

/**
 * Get facets for the prototype 1.
*/
Processor.prototype.getFacetsData= function(data, single_level_facets_callback, static_urls) {
	
	//build the facets tree
	var facet_data = [];
	var tree = {};
	
	var query = data['query'];
	
	var fdata = {};
		
	var mutants = {};
	var mutants_nodes = [];
	
	mutants.text = "Mutants";
	mutants.selectable = false;
	mutants.tags = [];
	mutants.tags.push(0);
	
	//Phenotype data
	var mutants_phenotype = {}
	mutants_phenotype.text = "Phenotype";
	mutants_phenotype.fulltext = "Mutant-Phenotype";
	mutants_phenotype.queryText = "PHENOTYPE_ANATOMY";
	mutants_phenotype.selectable = false;
	mutants_phenotype.tags = [];
	mutants_phenotype.tags.push(0);	
	mutants_phenotype.sampleType = "MUTANT"
	mutants_phenotype.parent = "Mutants"
	mutants_phenotype.query = query;
	
	//Expression data
	var mutants_expression = {}
	mutants_expression.text = "Expression";
	mutants_expression.fulltext = "Mutant-Expression";
	mutants_expression.queryText = "EXPRESSION";
	mutants_expression.selectable = false;
	mutants_expression.tags = [];
	mutants_expression.tags.push(0);
	mutants_expression.sampleType = "MUTANT"
	mutants_expression.parent = "Mutants"
	mutants_expression.query = query;
	
	//Integrating phenotype and expression data
	if (query.sampleType == mutants_phenotype.sampleType && query.imageType == mutants_phenotype.queryText) {
		mutants_phenotype.checked = true;
		mutants._nodes = mutants_nodes;
	}
	else{
		mutants_phenotype.checked = false;
		if($("#filters").tagExist(mutants_phenotype.fulltext))
			$("#filters").removeTag(mutants_phenotype);
	
		if (query.expanded[mutants.text])
			mutants._nodes = mutants_nodes;
		else
			mutants.nodes = mutants_nodes;
	}
	
	if (query.sampleType == mutants_expression.sampleType && query.imageType == mutants_expression.queryText) {
		mutants_expression.checked = true;
		mutants._nodes = mutants_nodes;
	}else{
		mutants_expression.checked = false;

		if($("#filters").tagExist(mutants_expression.fulltext)){
			$("#filters").removeTag(mutants_expression);
		}
		
		if (query.expanded[mutants.text])
			mutants._nodes = mutants_nodes;
		else
			mutants.nodes = mutants_nodes;
	}
	
	mutants_nodes.push(mutants_phenotype);
	mutants_nodes.push(mutants_expression);
	
	var wildtypes = {};
	var wildtypes_nodes = [];
	
	wildtypes.text = "Wildtype";
	wildtypes.selectable = false;
	wildtypes.tags = [];
	wildtypes.tags.push(0);
	
	var wildtypes_phenotype = {}
	wildtypes_phenotype.text = "Phenotype";
	wildtypes_phenotype.fulltext = "Wildtype-Phenotype";
	wildtypes_phenotype.queryText = "PHENOTYPE_ANATOMY";
	wildtypes_phenotype.selectable = false;
	wildtypes_phenotype.tags = [];
	wildtypes_phenotype.tags.push(0);
	wildtypes_phenotype.sampleType = "WILD_TYPE"
	wildtypes_phenotype.parent = "Wildtype"
	wildtypes_phenotype.query = query;
	
	if (query.sampleType == wildtypes_phenotype.sampleType && query.imageType == wildtypes_phenotype.queryText) {
		
		wildtypes_phenotype.checked = true;
		wildtypes._nodes = wildtypes_nodes;
		
	}else{
		wildtypes_phenotype.checked = false;
		if($("#filters").tagExist(wildtypes_phenotype.fulltext)){
			console.log("removing wildtype phenotype from box");
			$("#filters").removeTag(wildtypes_phenotype);
		}	
		
		if (query.expanded[wildtypes.text])
			wildtypes._nodes = wildtypes_nodes;
		else
			wildtypes.nodes = wildtypes_nodes;
	}
	
	var wildtypes_expression = {}
	wildtypes_expression.text = "Expression";
	wildtypes_expression.fulltext = "Wildtype-Expression";
	wildtypes_expression.queryText = "EXPRESSION";
	wildtypes_expression.selectable = false;
	wildtypes_expression.tags = [];
	wildtypes_expression.tags.push(0);
	wildtypes_expression.sampleType = "WILD_TYPE"
	wildtypes_expression.parent = "Wildtype"
	wildtypes_expression.query = query;
	
	if (query.sampleType == wildtypes_expression.sampleType && query.imageType == wildtypes_expression.queryText){
		wildtypes_expression.checked = true;
		wildtypes._nodes = wildtypes_nodes;
	
	}else{
		wildtypes_expression.checked = false;
		if($("#filters").tagExist(wildtypes_expression.fulltext))
			$("#filters").removeTag(wildtypes_expression);
		
		if (query.expanded[wildtypes.text])
			wildtypes._nodes = wildtypes_nodes;
		else
			wildtypes.nodes = wildtypes_nodes;
	}
	
	wildtypes_nodes.push(wildtypes_phenotype);
	wildtypes_nodes.push(wildtypes_expression);
	
	facet_data.push(mutants);
	facet_data.push(wildtypes);
	
	var sample_type_image_type = data['facet_counts']['facet_pivot']['sample_type,image_type'];
	var sample_type_image_type_count = sample_type_image_type.length;
		
	var facet_fields = data['facet_counts']['facet_fields'] ;
	
	for (i = 0; i < sample_type_image_type_count ; i++){
		if (sample_type_image_type[i].field == "sample_type"){
				
			if(sample_type_image_type[i].value == "MUTANT"){
				var pivots = sample_type_image_type[i].pivot.length;
				
				mutants.tags.pop();
				mutants.tags.push(sample_type_image_type[i].count);
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "PHENOTYPE_ANATOMY"){
						mutants_phenotype.tags.pop();
						mutants_phenotype.tags.push(sample_type_image_type[i].pivot[j].count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "EXPRESSION"){
						mutants_expression.tags.pop();
						mutants_expression.tags.push(sample_type_image_type[i].pivot[j].count);
					}
				}
				
			}else if (sample_type_image_type[i].value == "WILD_TYPE"){
				var pivots = sample_type_image_type[i].pivot.length;
				
				wildtypes.tags.pop();
				wildtypes.tags.push(sample_type_image_type[i].count);
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "PHENOTYPE_ANATOMY"){
						wildtypes_phenotype.tags.pop();
						wildtypes_phenotype.tags.push(sample_type_image_type[i].pivot[j].count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "EXPRESSION"){
						wildtypes_expression.tags.pop();
						wildtypes_expression.tags.push(sample_type_image_type[i].pivot[j].count);
					}
				}
			}
			
		}
	
	}
	
	single_level_facets_callback(facet_data, facet_fields, query);
	
	fdata.query = query;
	fdata.facet_data = facet_data;
	
	//Update filter box
	var facetsCount = facet_data.length;
	
	for (var i = 0; i < facetsCount; i++){
		var facet = facet_data[i];	
		
		if (facet.nodes){
			var nodeCount = facet.nodes.length;
			var nodes = facet.nodes;
			
			for (var j = 0 ; j < nodeCount ; j++){
				if(nodes[j].checked){
					if(!$("#filters").tagExist(nodes[j].fulltext)){
						nodes[j].waiter_url = static_urls.loader_url;
						$("#filters").addTag(nodes[j]);
					}
				}
						
			}
		}
			if (facet._nodes && !(facet.text == "Phenotype" || facet.text == "Anatomy" || facet.text == "Gene")){
			var nodeCount = facet._nodes.length;
			var nodes = facet._nodes;
			
			for (var k = 0 ; k < nodeCount ; k++){
				if(nodes[k].checked){
					if(!$("#filters").tagExist(nodes[k].fulltext)){
						nodes[k].waiter_url = static_urls.loader_url;
						$("#filters").addTag(nodes[k]);
					}
				}
						
			}
		}
			
	}
	
	return fdata;
};

/**
 * Facets prototype 3
*/
Processor.prototype.singleLevels = function(facet_data, facet_fields, query) {
	
	//Constants
	var METHODS_VALUE_COUNT = 2;
	var METHODS_VALUE_OFFSET = TAXON_VALUE_OFFSET = STAGE_VALUE_OFFSET = NODE_COUNT_INCREMENT = 1;
	var methods = {};
	var stages = {};
	var taxons = {};
	
	//single-level facets
	var stage = {};
	stage.text = "Stage";
	stage.selectable = false;
	stage.tags = [];
	stage.tags.push(0);
	
	var stage_nodes = [];
	
	var taxon = {};
	var taxon_tags = [];
	var taxon_nodes = [];
	taxon.text = "Taxon";
	taxon.selectable = false;
	taxon.tags = [];
	taxon.tags.push(0);
		
	var imaging_method_label = {};
	imaging_method_label.text = "ImagingMethod";
	imaging_method_label.selectable = false;
	imaging_method_label.tags = [];
	imaging_method_label_nodes = [];
	imaging_method_label.tags.push(0);
	
	var QUERY_TEXT = "imagingMethod";
	
	if (facet_fields){
		
		if (facet_fields.imaging_method_label && facet_fields.imaging_method_label != ""){
			
			//Obtain the number of imaging methods and counts: data structure is "methodName, count"
			var methodsCount = facet_fields.imaging_method_label.length, totalCount = 0 ;
			
			for (var i = 0 ; i < methodsCount ; i++){
				
				if(typeof facet_fields.imaging_method_label[i] == 'string'){
					methods[ facet_fields.imaging_method_label[i] ] = facet_fields.imaging_method_label[i + METHODS_VALUE_OFFSET] ;
						
				}else{
					totalCount = totalCount + facet_fields.imaging_method_label[i];
				}
				
			}
			
			var node_count = NODE_COUNT_INCREMENT, key;
			imaging_method_label.tags.pop();
			imaging_method_label.tags.push(totalCount);
			
			for (key in methods){
				
				var node = {};
				node.tags = [];
				node.text = key;
				node.queryText = key;
				node.fulltext = key;
				if (methods[key] == 0)
					node.disabled = true;
				node.tags.push(methods[key]);
				node.selectable = false;
				node.parent = imaging_method_label.text;
				node.query = query;
						
				imaging_method_label_nodes.push(node);
				
				if (query.imagingMethod.expanded && query.imagingMethod[node.text]) {
					node.checked = true;
					imaging_method_label._nodes = imaging_method_label_nodes;
				}else{
					node.checked = false;
					
					if($("#filters").tagExist(node.fulltext)){
						$("#filters").removeTag(node);
					}
					
					if (query.imagingMethod.expanded) {
						imaging_method_label._nodes = imaging_method_label_nodes;
					}else{
						imaging_method_label.nodes = imaging_method_label_nodes;						
					}

				}
				
				//increment node count;
				node_count = node_count + NODE_COUNT_INCREMENT;
			}
			
		}else{
			query.imagingMethod.expanded = false;
			imaging_method_label.nodes = imaging_method_label_nodes;
			
		}
		
		if (facet_fields.stage && facet_fields.stage != ""){
			
			//Obtain the number of imaging methods and counts: data structure is "methodName, count"
			var stageCount = facet_fields.stage.length, totalCount = 0 ;
			
			for (var i = 0 ; i < stageCount ; i++){
				
				if(typeof facet_fields.stage[i] == 'string'){
					stages[ facet_fields.stage[i] ] = facet_fields.stage[i + STAGE_VALUE_OFFSET] ;
				}else{
					totalCount = totalCount + facet_fields.stage[i];
				}
				
			}
			
			var node_count = NODE_COUNT_INCREMENT, key;
			stage.tags.pop();
			stage.tags.push(totalCount);
			
			//Build tree data structure for stage
			for (key in stages){
				
				var node = {};
				node.tags = [];
				node.text = key;
				node.queryText = key;
				node.fulltext = key;
				node.tags.push(stages[key]);
				node.selectable = false;
				node.parent = stage.text;
				node.query = query;
				
				stage_nodes.push(node);
				
				if (query.stage.expanded && query.stage[node.text]) {
					node.checked = true;
					stage._nodes = stage_nodes;
				}else{
					node.checked = false;
					
					if($("#filters").tagExist(node.fulltext)){
						$("#filters").removeTag(node);
					}
					
					if (query.stage.expanded)
						stage._nodes = stage_nodes;
					else
						stage.nodes = stage_nodes;
				}
				
				//increment node count;
				node_count = node_count + NODE_COUNT_INCREMENT;
			}
		}else{
			//attach empty node
			query.stage.expanded = false;
			stage.nodes = stage_nodes;
		}
		
		if (facet_fields.taxon && facet_fields.taxon != ""){
			
			//Obtain the number of imaging methods and counts: data structure is "methodName, count"
			var taxonCount = facet_fields.taxon.length, totalCount = 0;
			
			for (var i = 0 ; i < taxonCount ; i++){
				
				if(typeof facet_fields.taxon[i] == 'string'){
					taxons[ facet_fields.taxon[i] ] = facet_fields.taxon[i + TAXON_VALUE_OFFSET] ;
				}else{
					totalCount = totalCount + facet_fields.taxon[i];
				}
				
			}
			
			var node_count = NODE_COUNT_INCREMENT, key;
			taxon.tags.pop();
			taxon.tags.push(totalCount);
			
			//Build tree data for taxon
			for (key in taxons){
				
				var node = {};
				node.tags = [];
				node.text = key;
				node.queryText = key;
				node.fulltext = key;
				node.tags.push(taxons[key]);
				node.selectable = false;
				node.parent = taxon.text;
				node.query = query;
				
				taxon_nodes.push(node);
				
				if (query.taxon.expanded && query.taxon[node.text]) {
					node.checked = true;
					taxon._nodes = taxon_nodes;
				}else{
					node.checked = false;
					
					if($("#filters").tagExist(node.fulltext))
						$("#filters").removeTag(node);
					
					if (query.taxon.expanded)
						taxon._nodes = taxon_nodes;
					else
						taxon.nodes = taxon_nodes;
				}
				
				//increment node count;
				node_count = node_count + NODE_COUNT_INCREMENT;
			}
		}else{
			//attach empty node
			query.taxon.expanded = false;
			taxon.nodes = taxon_nodes ;
		}
		
	}

	facet_data.push(imaging_method_label);
	facet_data.push(stage);
	facet_data.push(taxon);
	
	Processor.facetSearch(facet_data, facet_fields, query);
};

Processor.facetSearch = function(facet_data, facet_fields, query) {
	//Anatomy facet search node
	var anatomy = {};
	anatomy.text = "Anatomy";
	anatomy.selectable = false;
	anatomy_nodes = [];
	var anatomy_nodes = [];
	
	var anatomy_field = {};
	anatomy_field.placeholderText = "Anatomy";
	anatomy_field.parent = anatomy.text;
	anatomy_field.textField = true;
	anatomy_field.query = query;
	anatomy_field.autosuggestEndpoint = "term";
	anatomy._nodes = anatomy_nodes;
	
	if (query.Anatomy.expanded){
		anatomy_field.queryText = query.anatomy.value;
		anatomy_nodes.push(anatomy_field);
		//anatomy._nodes = anatomy_nodes;
	}
	else{
		anatomy_field.queryText = "";
		anatomy_nodes.push(anatomy_field);
		//anatomy.nodes = anatomy_nodes;
	}
	
	//Gene facet search node
	var gene = {};
	gene.text = "Gene";
	gene.selectable = false;
	gene_nodes = [];
	var gene_nodes = [];
	
	var gene_field = {};
	gene_field.placeholderText = "Gene";
	gene_field.parent = gene.text;
	gene_field.textField = true;
	gene_field.query = query;
	gene_field.autosuggestEndpoint = "term";
	gene._nodes = gene_nodes;
	
	if (query.Gene.expanded){
		gene_field.queryText = query.gene.value;
		gene_nodes.push(gene_field);
		//gene._nodes = gene_nodes;
	}
	else{
		gene_field.queryText = "";
		gene_nodes.push(gene_field);
		//gene.nodes = gene_nodes;
	}
	
	//Phenotype facet search node
	var phenotype = {};
	phenotype.text = "Phenotype";
	phenotype.selectable = false;
	phenotype_nodes = [];
	var phenotype_nodes = [];
	
	var phenotype_field = {};
	phenotype_field.placeholderText = "Gene";
	phenotype_field.parent = phenotype.text;
	phenotype_field.textField = true;
	phenotype_field.query = query;
	phenotype_field.autosuggestEndpoint = "term";
	phenotype._nodes = phenotype_nodes;
	
	if (query.Phenotype.expanded){
		phenotype_field.queryText = query.phenotype.value;
		phenotype_nodes.push(phenotype_field);
		
	}
	else{
		phenotype_field.queryText = "";
		phenotype_nodes.push(phenotype_field);
		//phenotype.nodes = phenotype_nodes;
	}
	
	facet_data.push(anatomy);
	facet_data.push(gene);
	facet_data.push(phenotype);
	
};

//template for gallery view
var template = {
	list: '<ul id="og-grid" class="og-grid"></ul>',
	imageitem: '<li></li>',
	imagelink: '<a href=""></a>',
	image: '<img alt="image"/>'
};


