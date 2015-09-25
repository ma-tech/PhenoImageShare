$(function() {
	var dataURL = "http://aberlour.hgu.mrc.ac.uk:9090/IQS/getDataReleases?";
	var data = {"version":"100"}
	
	var request = $.ajax({
		  						method: "GET",
	  							url: dataURL,
		  						data: data,
								crossdomain: true,
								dataType:'json',
								//traditional:true
							});
	
	var result =  request.done(function( response ) {
		var releases = response.releases;
		var sources;
		var species;
		var ontologies;
		
		for (i = 0 ; i < releases[0].length ; i++){
			sources = releases[0][i].datasources[0];
			species = releases[0][i].species[0];
			ontologies = releases[0][i].ontologies[0];
			
			console.log(releases[0][i]['VERSION']);
			
			var sources_data = [];
			var species_data = [];
			var ontologies_data = [];
			var version = releases[0][i]['VERSION'].split('.').join("");
			$('#sources_'+ version + "_metadata").html("<b> Genes: </b> " + releases[0][i]['GENES_NUMBER'] +" | <b> Number of Images: </b>" +
			releases[0][i]['IMAGES_NUMBER'] + " | <b> Number of ROIs: </b>" + releases[0][i]['ROIS_NUMBER']  );
			
			console.log(releases[0][i]);
			
			for (source in sources){
				sources_data.push(Object.keys(sources[source]).map(function(k) { return sources[source][k] }));
			}
		
			for (specie in species){
				species_data.push(Object.keys(species[specie]).map(function(k) { return species[specie][k] }));
			}
			
			for (ontology in ontologies){
				ontologies_data.push(Object.keys(ontologies[ontology]).map(function(k) { return ontologies[ontology][k] }));
			}
			
			$('#sources_'+ version).DataTable({
				data: sources_data,
				bPaginate: false,
				ordering: false,
				bFilter: false, 
				bInfo: false,
				jQueryUI: false,
		        columns: [
		             { title: "Source" },
		             { title: "Number of Images" },
		             { title: "Import Date" },
		         ]
			});
			
			$('#species_' + version).DataTable({
				data: species_data,
				bPaginate: false,
				ordering: false,
				bFilter: false, 
				bInfo: false,
				jQueryUI: false,
		        columns: [
		             { title: "Name" },
		             { title: "Number of Images" },
		         ]
			});
			
			$('#ontologies_' + version).DataTable({
				data: ontologies_data,
				bPaginate: false,
				ordering: false,
				bFilter: false, 
				bInfo: false,
				jQueryUI: false,
		        columns: [
		             { title: "Ontology" },
		             { title: "Version" },
		         ]
			});
			
		}
	});
	
	request.fail(function( jqXHR, textStatus ) {
	  console.log(textStatus );
  });
  

	
})
	
	