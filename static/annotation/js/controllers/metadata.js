(function(OSD, $) {
	
	if (!$.version || $.version.revision < 1) {
	        throw new Error('Metadat panel requires Annotation Tool version 0.0.1+');
	}
	
    OSD.AnnotationTool.prototype.metadata = function(options) {
	     if (!this.metadataInstance) {
             options = options || {};
             options.annotationTool = this;
             this.metadataInstance = new $.Metadata(options);
         } else {
			 return this.metadataInstance;
         }
		 
		 return this.metadataInstance;
     };
	
	 OSD.AnnotationTool.prototype.getMetdata = function() {
		 return this.metadataInstance;
	 };
		
  $.Metadata = function(options) {
    
	options = options || {};
  
  	//shape buttons
    this.roi_table_id = options.roi_table_id || "roi_table_id";
	this.panel_id = options.panel_id || "panel_id";
	this.add_button_id = options.add_button_id || "add_button_id";
	this.roi_data = options.roi_data || [];
	this.swfURL = options.swfURL || "";
	
	//annotation tool
	this.annotationTool = options.annotationTool;
	
	this.myname = "Metdata Controller";
	
	//initialise metadata - setup events, etc.
	this.init();
	this.setupEventHandlers();
	
  };
  
   $.Metadata.prototype = {
   	
	   init: function(){
		   var data = this.prepareData(this.roi_data);
		   this.render(data);
		   this.addROI();
		   
		   console.log("["+this.myname + "]  Initialisation completed.");
		   return;
	   },
	   
	   setupEventHandlers: function (){
		   
	   },
	   
	   prepareData: function(data) {
		   	//prepare ROI and annotations data
		   	var rois = data;
		   	var texts = [];
		   	var channels = [];
			var rois_display = [];
		  
		   	var swfURL = this.swfURL;
		   	
		   	for(var i = 0; i < rois.length; i++){
		   		//var roi_width = this.imageDimensions[1] * (this.ROIs[i].x_coordinates[1] / 100) - this.imageDimensions[1] * (this.ROIs[i].x_coordinates[0] /  100);
		
		   		//var roi_height= this.imageDimensions[0] * (this.ROIs[i].y_coordinates[1] / 100) - this.imageDimensions[0] * (this.ROIs[i].y_coordinates[0] / 100);
		   		//var roi_dimension = roi_width + " x " + roi_height;
		   		var annotations = "";
		   		var channels = "";
		   		var annotation_data = [];
		   		var channels_data = {};
		
		   		if (rois[i].expressed_in_anatomy_term != undefined){
		   			for (var j = 0; j < rois[i].expressed_in_anatomy_term.length; j++){
		   				var data = {};
		   				data.term = rois[i].expressed_in_anatomy_term[j];
		   				data.type = 'ge_anatomy';
		   				annotation_data.push(data);
		   			}
			
		   			annotations = annotations +  "<b>Anatomy (Expression): </b>"+rois[i].expressed_in_anatomy_term +"<br/>";
		   		}
		
		   		if (rois[i].depicted_anatomy_term != undefined){
					for (var j = 0; j < rois[i].depicted_anatomy_term.length ; j++){
		   				var data = {};
		   				data.term = rois[i].depicted_anatomy_term[j];
						data.type = 'dpt_anatomy';
		   				annotation_data.push(data);
		   			}
			
		   			annotations = annotations +  "<b>Anatomy (Depicted): </b>"+rois[i].depicted_anatomy_term +"<br/>";
		   		}
		
		   		if (rois[i].phenotype_term != undefined) {
		   			for (var j = 0; j < rois[i].phenotype_term.length ; j++){
		   				var data = {};
		   				data.term = rois[i].phenotype_term[j];
		   				data.type = 'phenotype';
		   				annotation_data.push(data);
		   			}
		   			annotations = annotations +  "<b>Phenotypes:</b> "+rois[i].phenotype_term +"<br/>";
		   		}
		
		   		if (rois[i].abnormality_anatomy_term != undefined) {
					for (var j = 0; j < rois[i].abnormality_anatomy_term.length ; j++){
		   				var data = {};
		   				data.term = rois[i].abnormality_anatomy_term[j];
		   				data.type = 'abnormality';
		   				annotation_data.push(data);
		   			}
			
		   			annotations = annotations +  "<b>Abnormality:</b> "+rois[i].abnormality_anatomy_term +"<br/>";
		   		}
		
		   		if (rois[i].channels != undefined) {
		   			for (var  k = 0 ; k < rois[i].channels.length ; k++){
		   				channels_data[rois[i].channels[k].id] = trois[i].channels[k];
		   				channels = channels + rois[i].channels[k].gene_symbol
		   			}
		   		}
		
		   		texts[i] = annotation_data;
		   		channels[i] = channels_data;
		
		   		rois_display[i] = ["", annotations, channels, "", "", "",""];
		   	}	
		
			return [texts, channels, rois_display];
	   },
	   
	   render: function(data){
		   
		   var table_data = data;
	   	   var texts_map = {"dpt_anatomy":"Depicted Anatomy", "ge_anatomy": "Expression Anatomy", "abnormality":"Abnormal Anatomy", "phenotype":"Phenotype"};
		   
		   
		   console.log("===annotation data===");
		   console.log(table_data[0]);
		
		   console.log("===channels data===");
		   console.log(table_data[1]);
		
		   console.log("===display data===");
		   console.log(table_data[2]);
		   
		   	this.table = jQuery('#roitable').DataTable({
		   		"data": table_data[2],
		   		"bFilter": false,
		        "bLengthChange": false,
		   		paginate: false,
		   	    "ordering": false,
		           sDom: 'T<"clear">lfrtip',
		        "oTableTools": {
					 "sSwfPath": swfURL,
		            "aButtons": [
		               // "copy",
		                //"print",
		                {
		                    "sExtends":    "collection",
		                    "sButtonText": "Download",
		                    "aButtons":    [ "csv", "xls", "pdf", "copy","print" ]
		                }
		            ]
		        },
		   	    "fnCreatedRow": function( nRow, aData, iDataIndex ) {
		   	         // meant to set the id to one that links to server, but not working.
		   	        //$(nRow).attr('id',"myi"+iDataIndex);
		   	    },
		   		responsive:{ 
		   			details: {
		   			         type: 'column',
		   			         target: 'tr',
		   					 renderer: function ( api, rowIdx ) {
					
		   						 var data = api.cells( rowIdx, ':hidden' ).eq(0).map( function ( cell ) {
		   						                         var header = jQuery( api.column( cell.column ).header() );
 											
		   						                         return '<tr>'+
		   						                                 '<td>'+
		   						                                     header.text()+':'+
		   						                                 '</td> '+
		   						                                 '<td>'+
		   						                                     api.cell( cell ).data()+
		   						                                 '</td>'+
		   						                             '</tr>';
		   						  } ).toArray().join('');
 											 
		   											 //build table for annotations
		   											 var annotations = table_data[0][rowIdx];
											 
		   											 var annotations_template = '<caption><i>Annotations</i></caption><thead><tr><th>ID</th><th>Term</th><th>Type</th>'+
		   											 							 '<th>Curator</th><th>Created</th><th>Edit/Delete</th></tr></thead><tbody>';
											 
		   											 for (var i = 0 ; i < annotations.length; i++){
		   												annotations_template = annotations_template + '<td>'+ i +'</td> '+ '<td>' + annotations[i].term +'</td>' +
		   												 						'<td>' + texts_map[annotations[i].type] +'</td>' + '<td>User</td>'+ '<td>Created</td>'+ '<td>Edit/Delete</td></tr><tr>'
		   											 }
											 
		   											 annotations_template = annotations_template + '</tbody>'
											 
		   											 //build table for channels
											 
		   											 var channels = table_data[1][rowIdx];
											 
		   											 var channels_template = '<caption><i>Channels</i></caption><thead><tr><th>ID</th><th>Gene</th><th>Start</th>'+
		   											 						 '<th>End</th><th>Curator</th><<th>Created</th><</tr></thead><tbody>';
		   											 var channels_count = 0;
											 
		   											 for (key in channels){
		   											 	channels_template = channels_template + '<td>'+ channels_count +'</td> '+ '<td>' + channels[key].gene_symbol + '</td>' 
		   												 					+'<td>' + channels[key].start_pos +'</td>' + '<td>'+channels[key].end_pos+'</td></tr><tr>' 
												 
		   												 channels_count = channels_count + 1;
		   											 }
		   											 channels_template = channels_template + '</tbody>'
											 
		   											 var channels_template = jQuery('<table id="channelstable" class="display responsive nowrap" cellspacing="0" width="100%"/><br/>').append(channels_template);
		   											 var annotations_table = jQuery('<table id="annotationstable" class="display responsive nowrap" cellspacing="0" width="100%" style="font-size:10px"/><br/>').append(annotations_template);
		   											 var roi_table_ext = jQuery('<table/>').append( data );
											 
		   											 //return (data && annotations_template && channels_template ? $('<div/>').append(roi_table_ext).append(annotations_table).append(channels_template) : false);
		   											 return (data && annotations_template && channels_template ? jQuery('<div/>').append(roi_table_ext).append(annotations_table) : false); // temporary fix for channel table displaying without channel
	
		   					 }
		               }			
		   		},
		  
		   		columnDefs: [ {
		   		            className: 'control',
		   		            orderable: false,
		   					targets:   0
		   		        } ],
				
		   		order: [ 1, 'asc' ]	
		   	});
	
		   /*	var tt = new jQuery.fn.dataTable.TableTools(this.table, {
		              "sSwfPath": swfURL,
		   			"sRowSelect": "single"
		   	});
		  */
			 
		   	//jQuery(tt.fnContainer()).insertBefore('div.roitablediv');
	
		   	var _template = {
		   		table: '<table></table>',
		   		row: '<tr></tr>',
		   		linebreak:'<br/>',
		   		wrapper: '<div></div>'
		   	};
	
	   },
 
	   editROI: function(id, data){
		   
	   },
	   
	   deleteROI: function(id){
		   
	   },
	   	  
	   addROI: function(data){
	     /*  var t = $('#example').DataTable();
	       var counter = 1;
 
	       $('#addRow').on( 'click', function () {
	           t.row.add( [
	               counter +'.1',
	               counter +'.2',
	               counter +'.3',
	               counter +'.4',
	               counter +'.5'
	           ] ).draw( false );
 
	           counter++;
	       } );
	       // Automatically add a first row of data
	       $('#addRow').click();
		   */
		/* var counter = 1;
         this.table.row.add( [
             counter +'.1',
             counter +'.2',
             counter +'.3',
             counter +'.4',
             counter +'.5'
         ] ).draw( false );
		 */
	   },
	   
	   getTable: function(){
		   
	   },
	   
	   minimise: function() {

	   },
	   
	   maximise: function() {

	   },

	   restore: function() {

	   },
	   
	   destroy: function(){
	  	 //destroy this metadata panel
	   }
	   
   };
    
}(OpenSeadragon, AnnotationTool));