function Processor() {
	this.detail_base_url;
	this.facets_data;
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
	var facet_data = "";

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
		   facet_data = get_facets_data(data);
		   
			
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
		   
		 
 		console.log("Facets data" + facet_data);
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
		
       });	   
	

		
};

/**
 * Register a canvas with this controller.
*/
Processor.prototype.getFacetsData= function(data) {
	
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
	
	var phenotype_wildtypes = {}
	phenotype_wildtypes.text = "Wildtype";
	phenotype_wildtypes.selectable = false;
	phenotype_wildtypes.tags = [];
	
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
	
	var expression_wildtypes = {}
	expression_wildtypes.text = "Wildtype";
	expression_wildtypes.selectable = false;
	expression_wildtypes.tags = [];
	
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
	facet_data.push(imaging_method_label);
	facet_data.push(stage);
	facet_data.push(taxon);
	
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
						phenotype_mutant_count = sample_type_image_type[i].pivot[j].count;
						phenotype_mutants.tags.push(phenotype_mutant_count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "EXPRESSION"){
						expression_mutant_count = sample_type_image_type[i].pivot[j].count
						expression_mutants.tags.push(expression_mutant_count);
					}
				}
				
			}else if (sample_type_image_type[i].value == "WILD_TYPE"){
				var pivots = sample_type_image_type[i].pivot.length;
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "PHENOTYPE_ANATOMY"){
						phenotype_wildtype_count = sample_type_image_type[i].pivot[j].count;
						phenotype_wildtypes.tags.push(sample_type_image_type[i].pivot[j].count);
					}
					else if (sample_type_image_type[i].pivot[j].value == "EXPRESSION"){
						expression_wildtype_count = sample_type_image_type[i].pivot[j].count;
						expression_wildtypes.tags.push(sample_type_image_type[i].pivot[j].count);
					}
				}
			}
			
		}
	
	}
	
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
	
	phenotype_count = parseInt(phenotype_wildtype_count) + parseInt(phenotype_mutant_count);
	expression_count = parseInt(expression_wildtype_count) + parseInt(expression_mutant_count);
	
	phenotype.tags.push(phenotype_count);
	expression.tags.push(expression_count);
	
	return facet_data;
};

/**
 * Register a canvas with this controller.
*/
Processor.prototype.buildTree= function() {
	

		var dummy_data = [
		  {
		    text: "Phenotype",
			tags:['300'],
			selectable: false,
		    nodes: [
		      {
		        text: "Mutants",
				nodeicon: "glyphicon glyphicon-plus",
				href: "#child-1",
				tags: [45],
				selectable: false,
			  },
	          {
	         	   text: "Wildtype"
	          }
			]
		  },
	      {
  		    text: "Expression",
  			tags:['300'],
  			selectable: false,
  		    nodes: [
  		     	 {
  		       	 	text: "Mutants",
  					nodeicon: "glyphicon glyphicon-plus",
  					href: "#child-1",
  					tags: [45],
  					selectable: false,
				},
  	          	{
  	         	  	  text: "Wildtype"
  	         	}
  		     ]
		  }
		];
	
	    return dummy_data;
};

