function Processor() {
	this.detail_base_url;
};

/**
 * Register a canvas with this controller.
*/
Processor.prototype.setBaseURL= function(baseURL) {
	this.detail_base_url = baseURL;
};

Processor.prototype.loadJSON = function(){
	
	var getParams = '';
	var tableData = [];
	var searchString = $("#searchInput").val();

	var detail_base_url = this.detail_base_url;
	var get_facets_data = this.getFacetsData;
	var get_facets_data2 = this.getFacetsData2;
	var get_facets_data3 = this.getFacetsData3;
	var get_facets_data4 = this.getFacetsData4;
	var single_level_facets = this.singleLevels;
	
	var facet_data = "";
	var facet_data2 = "";
	var facet_data3 = "";
	var facet_data4 = "";

	$.getJSON("getImages?q="+searchString,getParams,
 	   function(data, textStatus, jqXHR)
 	   {
		   tableTitle.innerHTML=data.response.numFound +" records found from XY records searched";
		   
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
			 	
			   image =  image_hyperlink + "<img src="+image_url+" style=\"width: 50%;\"/> </a>";
			   
			   descr = "<b> Expression: </b>" + expression + ", <b> Anatomy: </b>" + anatomy + ", <b> Phenotype: </b>"  + phenotype + ", <b> Gene: </b>" + gene; //+ ", <b> ID: </b>" +  id;
			   
			   tableData[i]=[image, descr];
		   }
		   
		   //fetch facets data from response.
		   facet_data = get_facets_data(data, single_level_facets);
		   facet_data2 = get_facets_data2(data, single_level_facets);
		   facet_data3 = get_facets_data3(data);
		   facet_data4 = get_facets_data4(data);
			
   		$("#imgtable").dataTable().fnDestroy();
   		$('#imgtable').DataTable({
   			//"ajax": "get_images",
	       	"data": tableData,
   		 	"columns": [
   		       	{ "title": 'Image' },
   				{ "title": 'Description' }
   		  	  ],
			  "columnDefs": [
			    { "width": "70%", "targets": 1 }
			  
		      ],
   		 });	
		   
		 
 		console.log("Data for 1st prototype facets" + facet_data);
 	  	$('#facets').treeview({
 	   		data: facet_data,
 	   		showTags: true,
 	   	    /*onNodeSelected: function(event, node) {
   	 	
 	   			if (node.endnode){
			
 	   				if(document.getElementById(node.id+"-checkbox").checked == true){
 	   					document.getElementById(node.id+"-checkbox").checked = false;
 	   					console.log("Setting state to "+ document.getElementById(node.id+"-checkbox").checked );
 	   				}else{
 	   					document.getElementById(node.id+"-checkbox").checked = true;
 	   					console.log("Setting state to "+ document.getElementById(node.id+"-checkbox").checked);
 	   				}
 	   			}
	
 	   	   	} */
   
 	   	});
		
 		console.log("Data for 2nd prototype facets" + facet_data2);
 	  	$('#facets2').treeview({
 	   		data: facet_data2,
 	   		showTags: true,   
 	   	});
		
		
 		console.log("Data for 3rd prototype facets" + facet_data3);
 	  	$('#facets3').treeview({
 	   		data: facet_data3,
 	   		showTags: true,   
 	   	});
		
 		console.log("Data for 4th prototype facets" + facet_data4);
 	  	$('#facets4').treeview({
 	   		data: facet_data4,
 	   		showTags: true,   
 	   	});
		
		
       });	   
	

		
};

/**
 * Get facets for the prototype 1.
*/
Processor.prototype.getFacetsData= function(data, single_level_facets) {
	
	//build the facets tree
	var facet_data = [];
	var tree = {};
	var phenotype = {};
	var phenotype_nodes = [];
	
	phenotype.text = "Phenotype";
	phenotype.selectable = false;
	phenotype.tags = [];
	phenotype.nodes = phenotype_nodes;
	
	var phenotype_mutants = {}
	phenotype_mutants.text = "Mutants";
	phenotype_mutants.selectable = false;
	phenotype_mutants.tags = [];
	phenotype_mutants.tags.push(0);	
	
	var phenotype_wildtypes = {}
	phenotype_wildtypes.text = "Wildtype";
	phenotype_wildtypes.selectable = false;
	phenotype_wildtypes.tags = [];
	phenotype_wildtypes.tags.push(0);	
	
	phenotype_nodes.push(phenotype_mutants);
	phenotype_nodes.push(phenotype_wildtypes);
	
	var expression = {};
	var expression_nodes = [];
	
	expression.text = "Expression";
	expression.selectable = false;
	expression.tags = [];
	expression.nodes = expression_nodes;
	
	var expression_mutants = {}
	expression_mutants.text = "Mutants";
	expression_mutants.selectable = false;
	expression_mutants.tags = [];
	expression_mutants.tags.push(0);
	
	var expression_wildtypes = {}
	expression_wildtypes.text = "Wildtype";
	expression_wildtypes.selectable = false;
	expression_wildtypes.tags = [];
	expression_wildtypes.tags.push(0);
	
	expression_nodes.push(expression_mutants);
	expression_nodes.push(expression_wildtypes);
	
	var stage = {};
	stage.text = "Stage";
	stage.selectable = false;
	stage.tags = [];
	stage.tags.push(0);
	var stage_nodes = [];
	stage.nodes = stage_nodes;
	
	var taxon = {};
	var taxon_tags = [];
	var taxon_nodes = [];
	taxon.text = "Taxon";
	taxon.selectable = false;
	taxon.tags = [];
	taxon.tags.push(0);
	taxon.nodes = taxon_nodes;
	
	var platform = {};
	var platform_nodes = [];
	
	var level = {};
	var level_nodes = [];
	
	var imaging_method_label = {};
	imaging_method_label.text = "Imaging Method";
	imaging_method_label.selectable = false;
	imaging_method_label.tags = [];
	imaging_method_label.tags.push(0);
	
	var imaging_method_label_nodes = [];
	imaging_method_label.nodes = imaging_method_label_nodes;
	
	facet_data.push(phenotype);
	facet_data.push(expression);
	
	var sample_type_image_type = data['facet_counts']['facet_pivot']['sample_type,image_type'];
	var sample_type_image_type_count = sample_type_image_type.length;
	
	var facet_fields = data['facet_counts']['facet_fields'] ;
	
	var phenotype_mutant_count = 0;
	var phenotype_wildtype_count = 0;
	var expression_mutant_count = 0;
	var expression_wildtype_count = 0;
		
	for (i = 0; i < sample_type_image_type_count ; i++){
		if (sample_type_image_type[i].field == "sample_type"){
				
			if(sample_type_image_type[i].value == "MUTANT"){
				var pivots = sample_type_image_type[i].pivot.length;
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "PHENOTYPE_ANATOMY"){
						phenotype_mutants.tags.pop();
						
						phenotype_mutant_count = sample_type_image_type[i].pivot[j].count;
						phenotype_mutants.tags.push(phenotype_mutant_count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "EXPRESSION"){
						expression_mutants.tags.pop();
						
						expression_mutant_count = sample_type_image_type[i].pivot[j].count
						expression_mutants.tags.push(expression_mutant_count);
					}
				}
				
			}else if (sample_type_image_type[i].value == "WILD_TYPE"){
				var pivots = sample_type_image_type[i].pivot.length;
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "PHENOTYPE_ANATOMY"){
						phenotype_wildtypes.tags.pop();
						
						phenotype_wildtype_count = sample_type_image_type[i].pivot[j].count;
						phenotype_wildtypes.tags.push(sample_type_image_type[i].pivot[j].count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "EXPRESSION"){
						expression_wildtypes.tags.pop();
						
						expression_wildtype_count = sample_type_image_type[i].pivot[j].count;
						expression_wildtypes.tags.push(sample_type_image_type[i].pivot[j].count);
					}
				}
			}
			
		}
	
	}
	
	single_level_facets(facet_data,facet_fields);
	
	phenotype_count = parseInt(phenotype_wildtype_count) + parseInt(phenotype_mutant_count);
	expression_count = parseInt(expression_wildtype_count) + parseInt(expression_mutant_count);
	
	phenotype.tags.push(phenotype_count);
	expression.tags.push(expression_count);
	
	return facet_data;
};

/**
 * Facets prototype 2.
*/
Processor.prototype.getFacetsData2 = function(data, single_level_facets) {
	
	//build the facets tree
	var facet_data = [];
	var tree = {};
	var mutants = {};
	var mutants_nodes = [];
	
	mutants.text = "Mutants";
	mutants.selectable = false;
	mutants.tags = [];
	mutants.tags.push(0);
	mutants.nodes = mutants_nodes;
	
	var mutants_phenotype = {}
	mutants_phenotype.text = "Phenotype an.";
	mutants_phenotype.selectable = false;
	mutants_phenotype.tags = [];
	mutants_phenotype.tags.push(0);	
	
	var mutants_expression = {}
	mutants_expression.text = "Expression pttns";
	mutants_expression.selectable = false;
	mutants_expression.tags = [];
	mutants_expression.tags.push(0);
	
	mutants_nodes.push(mutants_phenotype);
	mutants_nodes.push(mutants_expression);
	
	var wildtypes = {};
	var wildtypes_nodes = [];
	
	wildtypes.text = "Wildtype";
	wildtypes.selectable = false;
	wildtypes.tags = [];
	wildtypes.nodes = wildtypes_nodes;
	
	var wildtypes_phenotype = {}
	wildtypes_phenotype.text = "Phenotype";
	wildtypes_phenotype.selectable = false;
	wildtypes_phenotype.tags = [];
	wildtypes_phenotype.tags.push(0);	
	
	var wildtypes_expression = {}
	wildtypes_expression.text = "Expression";
	wildtypes_expression.selectable = false;
	wildtypes_expression.tags = [];
	wildtypes_expression.tags.push(0);
	
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
	
	single_level_facets(facet_data, facet_fields);
	
	return facet_data;
	
};

/**
 * Facets prototype 2.
*/
Processor.prototype.getFacetsData3 = function(data, single_level_facets) {
	
	//build the facets tree
	var facet_data = [];
	var tree = {};
	var mutants = {};
	var mutants_nodes = [];
	
	mutants.text = "Mutants";
	mutants.selectable = false;
	mutants.tags = [];
	mutants.tags.push(0);
	mutants.nodes = mutants_nodes;
	
	var mutants_phenotype = {}
	mutants_phenotype.text = "Phenotype an";
	mutants_phenotype.selectable = false;
	mutants_phenotype.tags = [];
	mutants_phenotype.tags.push(0);	
	
	var mutants_expression = {}
	mutants_expression.text = "Expression";
	mutants_expression.selectable = false;
	mutants_expression.tags = [];
	mutants_expression.tags.push(0);
	
	mutants_nodes.push(mutants_phenotype);
	mutants_nodes.push(mutants_expression);
	
	var control = {};
	var control_nodes = [];
	
	control.text = "Control";
	control.selectable = false;
	control.tags = [];
	control.nodes = control_nodes;
	
	var control_phenotype = {}
	control_phenotype.text = "Phenotype an.";
	control_phenotype.selectable = false;
	control_phenotype.tags = [];
	control_phenotype.tags.push(0);	
	
	var control_expression = {}
	control_expression.text = "Expression";
	control_expression.selectable = false;
	control_expression.tags = [];
	control_expression.tags.push(0);
	
	control_nodes.push(control_phenotype);
	control_nodes.push(control_expression);
	
	facet_data.push(mutants);
	facet_data.push(control);
	
	//single-level facets
	var stage = {};
	stage.text = "Stage";
	stage.selectable = false;
	stage.tags = [];
	stage.tags.push(0);
	var stage_nodes = [];
	stage.nodes = stage_nodes;
	
	var species = {};
	var species_tags = [];
	var species_nodes = [];
	species.text = "Species";
	species.selectable = false;
	species.tags = [];
	species.tags.push(0);
	species.nodes = species_nodes;
	
	var species_mouse = {}
	species_mouse.text = "Mouse";
	species_mouse.selectable = false;
	species_mouse.tags = [];
	species_mouse.tags.push(0);	
	
	var species_fly = {}
	species_fly.text = "Fly";
	species_fly.selectable = false;
	species_fly.tags = [];
	species_fly.tags.push(0);
	
	species_nodes.push(species_mouse);
	species_nodes.push(species_fly);
	
	var sex = {};
	var sex_tags = [];
	var sex_nodes = [];
	sex.text = "Sex";
	sex.selectable = false;
	sex.tags = [];
	sex.tags.push(0);
	sex.nodes = sex_nodes;
	
	var sex_male = {}
	sex_male.text = "Male";
	sex_male.selectable = false;
	sex_male.tags = [];
	sex_male.tags.push(0);	
	
	var sex_female = {}
	sex_female.text = "Female";
	sex_female.selectable = false;
	sex_female.tags = [];
	sex_female.tags.push(0);
		
	sex_nodes.push(sex_male);
	sex_nodes.push(sex_female);
	
	var image_type = {};
	image_type.text = "Image type";
	image_type.selectable = false;
	image_type.tags = [];
	image_type.tags.push(0);
	
	var image_type_nodes = [];
	image_type.nodes = image_type_nodes;
	
	var image_type_lacz = {}
	image_type_lacz.text = "Lacz";
	image_type_lacz.selectable = false;
	image_type_lacz.tags = [];
	image_type_lacz.tags.push(0);	
	
	var image_type_other= {}
	image_type_other.text = "Other";
	image_type_other.selectable = false;
	image_type_other.tags = [];
	image_type_other.tags.push(0);
		
	image_type_nodes.push(image_type_lacz);
	image_type_nodes.push(image_type_other);
	
	facet_data.push(stage);
	facet_data.push(species);
	facet_data.push(image_type);
	facet_data.push(sex);
	
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
				
				control.tags.pop();
				control.tags.push(sample_type_image_type[i].count);
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "PHENOTYPE_ANATOMY"){
						control_phenotype.tags.pop();
						control_phenotype.tags.push(sample_type_image_type[i].pivot[j].count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "EXPRESSION"){
						control_expression.tags.pop();
						control_expression.tags.push(sample_type_image_type[i].pivot[j].count);
					}
				}
			}else if (sample_type_image_type[i].value == "SPECIES"){
				var pivots = sample_type_image_type[i].pivot.length;
				
				species.tags.pop();
				species.tags.push(sample_type_image_type[i].count);
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "MOUSE"){
						species_mouse.tags.pop();
						species_mouse.tags.push(sample_type_image_type[i].pivot[j].count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "FLY"){
						species_fly.tags.pop();
						species_fly.tags.push(sample_type_image_type[i].pivot[j].count);
					}
				}
			}else if (sample_type_image_type[i].value == "SEX"){
				var pivots = sample_type_image_type[i].pivot.length;
				
				sex.tags.pop();
				sex.tags.push(sample_type_image_type[i].count);
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "MALE"){
						sex_male.tags.pop();
						sex_male.tags.push(sample_type_image_type[i].pivot[j].count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "FEMALE"){
						sex_female.tags.pop();
						sex_female.tags.push(sample_type_image_type[i].pivot[j].count);
					}
				}
			}else if (sample_type_image_type[i].value == "IMAGE_TYPE"){
				var pivots = sample_type_image_type[i].pivot.length;
				
				image_type.tags.pop();
				image_type.tags.push(sample_type_image_type[i].count);
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "Lacz"){
						image_type_lacz.tags.pop();
						image_type_lacz.tags.push(sample_type_image_type[i].pivot[j].count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "Other"){
						image_type_other.tags.pop();
						image_type_other.tags.push(sample_type_image_type[i].pivot[j].count);
					}
				}
			}
			
		}
	
	}
	
	if (facet_fields){
		if (facet_fields.stage && facet_fields.stage != ""){
			stage.tags.pop();
			
			stage_1 = {};
			stage_1.text = facet_fields.stage[0];
			stage_1.tags = [];
			stage_1.selectable = false;
			
			stage_1.tags.push(facet_fields.stage[1]);
			
			stage_nodes.push(stage_1);
			stage.tags.push(facet_fields.stage[1]);
		}
		
	}
	
	return facet_data;
	
};


/**
 * Get facets for the prototype 4.
*/
Processor.prototype.getFacetsData4= function(data, single_level_facets) {
	
	//build the facets tree
	var facet_data = [];
	var tree = {};
	var phenotype = {};
	var phenotype_nodes = [];
	
	phenotype.text = "Phenotype";
	phenotype.selectable = false;
	phenotype.tags = [];
	phenotype.nodes = phenotype_nodes;
	
	var phenotype_mutants = {}
	phenotype_mutants.text = "Mutants";
	phenotype_mutants.selectable = false;
	phenotype_mutants.tags = [];
	phenotype_mutants.tags.push(0);	
	
	var phenotype_wildtypes = {}
	phenotype_wildtypes.text = "Wildtype";
	phenotype_wildtypes.selectable = false;
	phenotype_wildtypes.tags = [];
	phenotype_wildtypes.tags.push(0);	
	
	phenotype_nodes.push(phenotype_mutants);
	phenotype_nodes.push(phenotype_wildtypes);
	
	var expression = {};
	var expression_nodes = [];
	
	expression.text = "Expression";
	expression.selectable = false;
	expression.tags = [];
	expression.nodes = expression_nodes;
	
	var expression_mutants = {}
	expression_mutants.text = "Mutants";
	expression_mutants.selectable = false;
	expression_mutants.tags = [];
	expression_mutants.tags.push(0);
	
	var expression_wildtypes = {}
	expression_wildtypes.text = "Wildtype";
	expression_wildtypes.selectable = false;
	expression_wildtypes.tags = [];
	expression_wildtypes.tags.push(0);
	
	expression_nodes.push(expression_mutants);
	expression_nodes.push(expression_wildtypes);
	
	var gene = {};
	gene.text = "Gene";
	gene.selectable = false;
	gene.tags = [];
	gene.tags.push(0);
	var gene_nodes = [];
	gene.nodes = gene_nodes;

	var platform = {};
	var platform_nodes = [];
	platform.text = "Platform(Im. Mod.)";
	platform.selectable = false;
	platform.tags = [];
	platform.tags.push(0);
	platform.nodes = platform_nodes;
	
	var platform_wholeamount = {}
	platform_wholeamount.text = "Whole Amount";
	platform_wholeamount.selectable = false;
	platform_wholeamount.tags = [];
	platform_wholeamount.tags.push(0);
	
	var platform_immunochemistry = {}
	platform_immunochemistry.text = "Immunochemistry";
	platform_immunochemistry.selectable = false;
	platform_immunochemistry.tags = [];
	platform_immunochemistry.tags.push(0);
	
	var platform_confocal = {}
	platform_confocal.text = "Confocal";
	platform_confocal.selectable = false;
	platform_confocal.tags = [];
	platform_confocal.tags.push(0);
	
	platform_nodes.push(platform_wholeamount);
	platform_nodes.push(platform_immunochemistry);
	platform_nodes.push(platform_confocal);
		
	var level = {};
	var level_nodes = [];
	level.text = "Level";
	level.selectable = false;
	level.tags = [];
	level.tags.push(0);
	level.nodes = level_nodes;

	var level_organism = {}
	level_organism.text = "Organism";
	level_organism.selectable = false;
	level_organism.tags = [];
	level_organism.tags.push(0);
	
	var level_cell = {}
	level_cell.text = "Cell";
	level_cell.selectable = false;
	level_cell.tags = [];
	level_cell.tags.push(0);
	
	var level_other = {}
	level_other.text = "Other";
	level_other.selectable = false;
	level_other.tags = [];
	level_other.tags.push(0);
	
	level_nodes.push(level_organism);
	level_nodes.push(level_cell);
	level_nodes.push(level_other);
	
	var stage = {};
	stage.text = "Stage";
	stage.selectable = false;
	stage.tags = [];
	stage.tags.push(0);
	var stage_nodes = [];
	stage.nodes = stage_nodes;
	
	facet_data.push(phenotype);
	facet_data.push(expression);
	facet_data.push(gene);
	facet_data.push(stage);
	facet_data.push(platform);	
	facet_data.push(level);
	
	var sample_type_image_type = data['facet_counts']['facet_pivot']['sample_type,image_type'];
	var sample_type_image_type_count = sample_type_image_type.length;
	
	var facet_fields = data['facet_counts']['facet_fields'] ;
	
	var phenotype_mutant_count = 0;
	var phenotype_wildtype_count = 0;
	var expression_mutant_count = 0;
	var expression_wildtype_count = 0;
		
	for (i = 0; i < sample_type_image_type_count ; i++){
		if (sample_type_image_type[i].field == "sample_type"){
				
			if(sample_type_image_type[i].value == "MUTANT"){
				var pivots = sample_type_image_type[i].pivot.length;
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "PHENOTYPE_ANATOMY"){
						phenotype_mutants.tags.pop();
						
						phenotype_mutant_count = sample_type_image_type[i].pivot[j].count;
						phenotype_mutants.tags.push(phenotype_mutant_count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "EXPRESSION"){
						expression_mutants.tags.pop();
						
						expression_mutant_count = sample_type_image_type[i].pivot[j].count
						expression_mutants.tags.push(expression_mutant_count);
					}
				}
				
			}else if (sample_type_image_type[i].value == "WILD_TYPE"){
				var pivots = sample_type_image_type[i].pivot.length;
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "PHENOTYPE_ANATOMY"){
						phenotype_wildtypes.tags.pop();
						
						phenotype_wildtype_count = sample_type_image_type[i].pivot[j].count;
						phenotype_wildtypes.tags.push(sample_type_image_type[i].pivot[j].count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "EXPRESSION"){
						expression_wildtypes.tags.pop();
						
						expression_wildtype_count = sample_type_image_type[i].pivot[j].count;
						expression_wildtypes.tags.push(sample_type_image_type[i].pivot[j].count);
					}
				}
			}else if (sample_type_image_type[i].value == "PLATFORM"){
				var pivots = sample_type_image_type[i].pivot.length;
				platform.tags.pop();
				platform.tags.push(sample_type_image_type[i].count);
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "WHOLEAMOUNT"){
						platform_wholeamount.tags.pop();
						platform_wholeamount.tags.push(sample_type_image_type[i].pivot[j].count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "IMMUNOCHEMISTRY"){
						platform_immunochemistry.tags.pop();
						platform_immunochemistry.tags.push(sample_type_image_type[i].pivot[j].count);
					}else if (sample_type_image_type[i].pivot[j].value == "CONFOCAL"){
						platform_confocal.tags.pop();
						platform_confocal.tags.push(sample_type_image_type[i].pivot[j].count);
					}
				}
			}else if (sample_type_image_type[i].value == "LEVEL"){
				var pivots = sample_type_image_type[i].pivot.length;
				level.tags.pop();
				level.tags.push(sample_type_image_type[i].count);
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "ORGANISM"){
						level_organism.tags.pop();
						level_organism.tags.push(sample_type_image_type[i].pivot[j].count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "CELL"){
						level_cell.tags.pop();
						level_cell.tags.push(sample_type_image_type[i].pivot[j].count);
					}else if (sample_type_image_type[i].pivot[j].value == "OTHER"){
						level_other.tags.pop();
						level_other.tags.push(sample_type_image_type[i].pivot[j].count);
					}
				}
			}
			
		}
	
	}
	
	phenotype_count = parseInt(phenotype_wildtype_count) + parseInt(phenotype_mutant_count);
	expression_count = parseInt(expression_wildtype_count) + parseInt(expression_mutant_count);
	
	phenotype.tags.push(phenotype_count);
	expression.tags.push(expression_count);
	
	var facet_fields = data['facet_counts']['facet_fields'] ;
		
	if (facet_fields){
		if (facet_fields.stage && facet_fields.stage != ""){
			stage.tags.pop();
			
			stage_1 = {};
			stage_1.text = facet_fields.stage[0];
			stage_1.tags = [];
			stage_1.selectable = false;
			
			stage_1.tags.push(facet_fields.stage[1]);
			
			stage_nodes.push(stage_1);
			stage.tags.push(facet_fields.stage[1]);
		}
		
	}
	
	
	return facet_data;
};

/**
 * Facets prototype 3
*/
Processor.prototype.singleLevels = function(facet_data, facet_fields) {
	
	//single-level facets
	var stage = {};
	stage.text = "Stage";
	stage.selectable = false;
	stage.tags = [];
	stage.tags.push(0);
	var stage_nodes = [];
	stage.nodes = stage_nodes;
	
	var taxon = {};
	var taxon_tags = [];
	var taxon_nodes = [];
	taxon.text = "Taxon";
	taxon.selectable = false;
	taxon.tags = [];
	taxon.tags.push(0);
	taxon.nodes = taxon_nodes;
	
	var platform = {};
	var platform_nodes = [];
	
	var level = {};
	var level_nodes = [];
	
	var imaging_method_label = {};
	imaging_method_label.text = "Imaging Method";
	imaging_method_label.selectable = false;
	imaging_method_label.tags = [];
	imaging_method_label.tags.push(0);
	
	var imaging_method_label_nodes = [];
	imaging_method_label.nodes = imaging_method_label_nodes;
	
	if (facet_fields){
		if (facet_fields.imaging_method_label && facet_fields.imaging_method_label != ""){
			imaging_method_label.tags.pop();
			
			imaging_method_label_1 = {};
			imaging_method_label_1.text = facet_fields.imaging_method_label[0];
			imaging_method_label_1.tags = [];
			imaging_method_label_1.selectable = false;
			
			imaging_method_label_1.tags.push(facet_fields.imaging_method_label[1]);
			
			imaging_method_label_nodes.push(imaging_method_label_1);
			imaging_method_label.tags.push(facet_fields.imaging_method_label[1]);
		}
		if (facet_fields.stage && facet_fields.stage != ""){
			stage.tags.pop();
			
			stage_1 = {};
			stage_1.text = facet_fields.stage[0];
			stage_1.tags = [];
			stage_1.selectable = false;
			
			stage_1.tags.push(facet_fields.stage[1]);
			
			stage_nodes.push(stage_1);
			stage.tags.push(facet_fields.stage[1]);
		}
		if (facet_fields.taxon && facet_fields.taxon != ""){
			taxon.tags.pop();
			
			taxon_1 = {};
			taxon_1.text = facet_fields.taxon[0];
			taxon_1.tags = [];
			taxon_1.selectable = false;
			
			taxon_1.tags.push(facet_fields.taxon[1]);
			
			taxon_nodes.push(taxon_1);
			taxon.tags.push(facet_fields.taxon[1]);
		}
		
	}
	
	facet_data.push(imaging_method_label);
	facet_data.push(stage);
	facet_data.push(taxon);
	
};
