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
	var searchString = $("#searchInput").val()
	var detail_base_url = this.detail_base_url;
	
	
	$.getJSON("getImages?q="+searchString,getParams,
 	   function(data, textStatus, jqXHR)
 	   {
		   tableTitle.innerHTML=data.response.numFound +" records found from XY records searched";
		   
		   var numDocs = data.response.docs.length;
		   for (var i = 0; i < numDocs; i++) {
		      
			   id = data.response.docs[i].id; //capture image id.
			   image_url = data.response.docs[i].image_url;
			   image_query_string = searchString;
			   
			   detail_url = detail_base_url + "?q="+searchString+"&img="+image_url
			   image_hyperlink = "<a href="+detail_url+" data-toggle=\"tooltip\" title="+ id +">"
			   
			   image =  image_hyperlink + "<img src=\"http://placehold.it/150x120\"/> </a>"
			   descr = image_hyperlink + id
			   
			   tableData[i]=[image, descr];
		   }
		   
   		$("#imgtable").dataTable().fnDestroy();
   		$('#imgtable').DataTable({
   			//"ajax": "get_images",
	       	"data": tableData,
   		 	"columns": [
   		       	{ "title": 'Image' },
   				{ "title": 'Description' }
   		  	  ],
			  "columnDefs": [
			    { "width": "40%", "targets": 1 }
			  
		      ],
   		 });	
		   
       });	   
	
};