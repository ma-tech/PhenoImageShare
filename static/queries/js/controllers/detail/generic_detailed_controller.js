function DetailedController(){
 	this.associatedROIURL = "";
	this.imageURL = "";
	this.queryString = "";
	this.annotationBaseURL = "";
	this.ROIs = "";
};

DetailedController.prototype.initialiseElements= function() { 
 /* $("#annotation_accordion").draggable({
	  drag: function (event, ui) {
		  console.log("[GUI] Dragging drawing tool: "+$("#annotation_accordion"));
	  }
  });
  */
	
  var service_status = this.status;
	 
  if (this.status != "OK"){
	  $('<div/>').qtip({
	          content: {
	              text: service_status['NOK'],
	              title: {
	                  text: 'Attention!',
	                  button: false
	              }
	          },
	          position: {
	              target: [0,0],
	              container: $('#error-warning-dv')
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
  				classes:"jgrowl qtip-red",
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
	                          if (e.type !== 'mouseover') {
	                              api.timer = setTimeout(function() { api.hide(e) }, lifespan);
	                          }
	                      })
	                      .triggerHandler('mouseout');
	                  }
	              }
	          }
	      });
  }
		 
  var associatedROIURL = this.associatedROIURL;
  var imageURL = this.imageURL;
  var queryString = this.queryString;
  var annotationBaseURL = this.annotationBaseURL;
  var imageId = this.imageId;
  
$("#drawingToolButton").on( "click", function() {
	console.log("[Detailed View Controller] Launching Drawing Tool with parameters: "+imageId);
	
	DetailedController.openwindow(imageId, annotationBaseURL);
});


$( "#annotation_accordion" ).on( "position_tool", function() {
	positionTool();
});

};

DetailedController.prototype.positionTool= function() { 
	annotation_accordion.style.left = (annotation_accordion.style.left+1200)+'px'; 
	annotation_accordion.style.top = '-700px'; 
};

DetailedController.prototype.enabledSlider= function() {
	$( "#slider" ).slider({
			change: function( event, ui ) {
				console.log("Size slider changing value to: " + $( "#slider" ).slider( "option", "value" ))
			}
		});
};

DetailedController.prototype.setParams= function(params) {
	this.associatedROIURL = params.associatedROIURL;
	this.imageURL = params.imageURL;
	this.imageId = params.imageId;
	this.annotationBaseURL = params.annotationBaseURL;
	this.ROIs = params.ROIs;
	this.imageDimensions = params.imageDimensions;
	this.swfURL = params.swfURL;
	this.status = params.status;
}

DetailedController.openwindow= function(imageId, annotationBaseURL) {
 var image = "?imageId=" + imageId;
 var annotationToolURL = annotationBaseURL + image
 
 var drawingWindow = window.open(annotationToolURL,"_blank","height=1000,width=1400,status=yes, scrollbars=yes,top=500px, left=400px");
 
 console.log("[Drawing View] Loading image: "+ imageId);
};

DetailedController.prototype.displayROIs= function() { 
	//prepare ROI and annotations data
	var roi_display_data = [];
	var roi_annotation_data = [];
	var roi_channels_data = [];
	var annotations_type_map = {"dpt_anatomy":"Depicted Anatomy", "ge_anatomy": "Expression Anatomy", "abnormality":"Abnormal Anatomy", "phenotype":"Phenotype"};
		
	var swfURL = this.swfURL;
	var rois = this.ROIs;
	
	for(var i = 0; i < this.ROIs.length; i++){
		var roi_width = this.imageDimensions[1] * (this.ROIs[i].x_coordinates[1] / 100) - this.imageDimensions[1] * (this.ROIs[i].x_coordinates[0] /  100);
		
		var roi_height= this.imageDimensions[0] * (this.ROIs[i].y_coordinates[1] / 100) - this.imageDimensions[0] * (this.ROIs[i].y_coordinates[0] / 100);
		var roi_dimension = roi_width + " x " + roi_height;
		var annotations = "";
		var channels = "";
		var annotation_data = [];
		var channels_data = {};
		
		if (this.ROIs[i].expressed_in_anatomy_term != undefined){
			for (var j = 0; j < this.ROIs[i].expressed_in_anatomy_term.length ; j++){
				var data = {};
				data.term = this.ROIs[i].expressed_in_anatomy_term[j];
				data.type = 'ge_anatomy';
				annotation_data.push(data);
			}
			
			annotations = annotations +  "<b>Anatomy (Expression): </b>"+this.ROIs[i].expressed_in_anatomy_term +"<br/>";
		}
		
		if (this.ROIs[i].depicted_anatomy_term != undefined){
			
			for (var j = 0; j < this.ROIs[i].depicted_anatomy_term.length ; j++){
				var data = {};
				data.term = this.ROIs[i].depicted_anatomy_term[j];
				data.type = 'dpt_anatomy';
				annotation_data.push(data);
			}
			
			annotations = annotations +  "<b>Anatomy (Depicted): </b>"+this.ROIs[i].depicted_anatomy_term +"<br/>";
		}
		
		if (this.ROIs[i].phenotype_term != undefined) {

			for (var j = 0; j < this.ROIs[i].phenotype_term.length ; j++){
				var data = {};
				data.term = this.ROIs[i].phenotype_term[j];
				data.type = 'phenotype';
				annotation_data.push(data);
			}
			annotations = annotations +  "<b>Phenotypes:</b> "+this.ROIs[i].phenotype_term +"<br/>";
		}
		
		if (this.ROIs[i].abnormality_anatomy_term != undefined) {
			
			for (var j = 0; j < this.ROIs[i].abnormality_anatomy_term.length ; j++){
				var data = {};
				data.term = this.ROIs[i].abnormality_anatomy_term[j];
				data.type = 'abnormality';
				annotation_data.push(data);
			}
			
			annotations = annotations +  "<b>Abnormality:</b> "+this.ROIs[i].abnormality_anatomy_term +"<br/>";
		}
		
		if (this.ROIs[i].channels != undefined) {
			for (var  k = 0 ; k < this.ROIs[i].channels.length ; k++){
				channels_data[this.ROIs[i].channels[k].id] = this.ROIs[i].channels[k];
				channels = channels + this.ROIs[i].channels[k].gene_symbol
			}
		}
		
		roi_annotation_data[i] = annotation_data;
		roi_channels_data[i] = channels_data;
		
		roi_display_data[i] = ["", annotations, channels, "", "", "",""];
	}	

	/*
	$('#roitable').DataTable({
       	"data": roi_display_data,
		"bFilter": false,
        "bLengthChange": false,
        scrollY: 150,
		filter:false,
        dom: 'T<"clear">lfrtip',
        tableTools: {
           "sSwfPath": swfURL,
			"sRowSelect": "single"
        }
	 });
	*/
	
	var table = $('#roitable').DataTable({
		"data": roi_display_data,
		"bFilter": false,
        "bLengthChange": false,
		paginate: false,
	    "ordering": false,
        dom: 'TC<"clear">lfrtip',
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
						                         var header = $( api.column( cell.column ).header() );
 											
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
											 var annotations = roi_annotation_data[rowIdx];
											 
											 var annotations_template = '<caption><i>Annotations</i></caption><thead><tr><th>ID</th><th>Term</th><th>Type</th>'+
											 							 '<th>Curator</th><th>Created</th><th>Edit/Delete</th></tr></thead><tbody>';
											 
											 for (var i = 0 ; i < annotations.length; i++){
												annotations_template = annotations_template + '<td>'+ i +'</td> '+ '<td>' + annotations[i].term +'</td>' +
												 						'<td>' + annotations_type_map[annotations[i].type] +'</td>' + '<td>User</td>'+ '<td>Created</td>'+ '<td>Edit/Delete</td></tr><tr>'
											 }
											 
											 annotations_template = annotations_template + '</tbody>'
											 
											 //build table for channels
											 
											 var channels = roi_channels_data[rowIdx];
											 
											 var channels_template = '<caption><i>Channels</i></caption><thead><tr><th>ID</th><th>Gene</th><th>Start</th>'+
											 						 '<th>End</th><th>Curator</th><<th>Created</th><</tr></thead><tbody>';
											 var channels_count = 0;
											 
											 for (key in channels){
											 	channels_template = channels_template + '<td>'+ channels_count +'</td> '+ '<td>' + channels[key].gene_symbol + '</td>' 
												 					+'<td>' + channels[key].start_pos +'</td>' + '<td>'+channels[key].end_pos+'</td></tr><tr>' 
												 
												 channels_count = channels_count + 1;
											 }
											 channels_template = channels_template + '</tbody>'
											 
											 var channels_template = $('<table id="channelstable" class="display responsive nowrap" cellspacing="0" width="90%"/><br/>').append(channels_template);
											 var annotations_table = $('<table id="annotationstable" class="display responsive nowrap" cellspacing="0" width="90%"/><br/>').append(annotations_template);
											 var roi_table_ext = $('<table/>').append( data );
											 
											 
											 //return (data && annotations_template && channels_template ? $('<div/>').append(roi_table_ext).append(annotations_table).append(channels_template) : false);
											 return (data && annotations_template && channels_template ? $('<div/>').append(roi_table_ext).append(annotations_table) : false); // temporary fix for channel table displaying without channel
											 
											 /* routine to permanently fix channel table displaying without existing channels.: TODO
											 var final_table_div = $('<div/>');
											 
											 if (data){
												 if (annotations != undefined){
													 final_table_div.append(roi_table_ext).append(annotations_table);
												 }
											 
												 if (channels != undefined){
													 final_table_div.append(channels_template);
												 }
												 
												 return final_table_div;
											 }
											 
											 return false;	
											*/
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
	
	
	var tt = new $.fn.dataTable.TableTools(table, {
           "sSwfPath": swfURL,
			"sRowSelect": "single"
	});
	
	$(tt.fnContainer()).insertBefore('div.roitablediv');
	
	
	var _template = {
		table: '<table></table>',
		row: '<tr></tr>',
		linebreak:'<br/>',
		wrapper: '<div></div>'
	};
	
	//adding tooltip to each row
	/*
    table.$('tr').qtip({
        content: {
                text: function(event, api) {
                    $.ajax({
                        url: "/search/detail/getRoiData?id="+rois[api.get('id')].id // Use href attribute as URL
                    })
                    .then(function(content) {
						
							var annotations_table = '<caption><i>Annotations</i></caption><thead><tr><th>ID</th><th>Term</th><th>Type</th>'+
							 '<th>Curator</th><th>Created</th><th>Edit/Delete</th></tr></thead><tbody></tbody>';
							
							var channels_table = '<caption><i>Channels</i></caption><thead><tr><th>ID</th><th>Gene</th><th>Start</th>'+
							 '<th>End</th><th>Curator</th><th>Edit/Delete</th></tr></thead><tbody></tbody>';
							 
							for (var i = 0; i < content.length ; i++){
   							 	var annotation_data = [];
   							 	var term = "";
							 	var type = "";
								var channels_data = [];
								var gene = "";
								var start = "";
								var end = "";
								
								if (content[i].expressed_in_anatomy_term !=undefined){
									term = content[i].expressed_in_anatomy_term;
									type = "anatomy";
								}else if (content[i].phenotype_term !=undefined){
									term = content[i].phenotype_term;
									type = "phenotype";
								}else if (content[i].abnormality_in_anatomical_structure !=undefined){
									term = content[i].abnormality_in_anatomical_structure;
									type = "abnormal anatomy";
								}
								
								if (content[i].channels !=undefined){
									for (var j = 0; j < content[i].channels.length ; j++){
										gene = content[i].channels[j].gene_symbol;
										start = content[i].channels[j].start_pos;
										end = content[i].channels[j].end_pos;
										channels_data[j] = [j, gene, start, end, "curator", "created date"]
									}
								}
								
								annotation_data [i] = [i, term, type, "curator", "created", "Edit/Delete"]
							}
							
							$('#annotationtablediv')
								.append($(_template.wrapper)
									.attr('id','wrapper-div'+rois[api.get('id')].id)
									.append($(_template.table)
									.addClass('display responsive nowrap')
									.attr('id','annotations_'+rois[api.get('id')].id)
									.append(annotations_table))
									.append($(_template.linebreak))
									.append($(_template.table)
									.addClass('display compact responsive nowrap')
									.attr('id','channel_'+rois[api.get('id')].id)
									.append(channels_table)));
							
								
							//$('#channelstablediv').append($(_template.table).addClass('display compact responsive nowrap').attr('id',rois[api.get('id')].id).append(annotations_table));
							
							//console.log($('#annotationtablediv'));
							var annotationstable = $('#annotations_'+rois[api.get('id')].id).DataTable({
																		"data": annotation_data,
																		"bFilter": false,
																        "bLengthChange": false,
																		paginate: false,
																	    "ordering": false,
																		"bInfo" : false,	
																		});
																		
							var channelstable = $('#channel_'+rois[api.get('id')].id).DataTable({
																		"data": channels_data,
																		"bFilter": false,
																        "bLengthChange": false,
																		paginate: false,
																	    "ordering": false,
																		"bInfo" : false,	
																		});
																		
							//display_div = $('#channelstablediv').append( annotations_table ).append( channels_table );
							
                        // Set the tooltip content upon successful retrieval
                        api.set('content.text', $('#wrapper-div'+rois[api.get('id')].id));
                    }, function(xhr, status, error) {
                        // Upon failure... set the tooltip content to error
                        api.set('content.text', status + ': ' + error);
                    });
        
                    return 'Loading...'; // Set some initial text
                },
				title: '<b>Annotations and Channels</b>',
				button: true
            },
        position: {
            target: 'mouse', // Use the mouse position as the position origin
            adjust: {
                // Don't adjust continuously the mouse, just use initial position
                x: 12,
				y:12,
				mouse:false
            },
			viewport: $(window)  
        },
        show: {
            solo: true
        },
      	
		/*
       hide: {
             event: false,
             inactive: 3000
       },
	   
	   hide: 'unfocus',
		
       events: {
           
       },
	style:{
		classes:"qtip-bootstrap",
		width: 600,
	}
    });
	*/
};