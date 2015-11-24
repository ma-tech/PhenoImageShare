function Search() {

};

/**
 * initialise search script
*/
Search.prototype.init= function(baseURL) {
	//autosuggest JS library 
	var terms = new Bloodhound({
	    datumTokenizer: function (datum) {
	        return Bloodhound.tokenizers.whitespace(datum.value);
	    },
	    queryTokenizer: Bloodhound.tokenizers.whitespace,
	    remote: {
	        url: base_query_url + autosuggest_acp + '%QUERY',
	        filter: function (data) {
	            return $.map(data, function (term) {
	                return {
	                    value: term
	                };
	            });
	        }
	    }
	});
	
	terms.initialize();
	
	$('#searchInput').typeahead({
		highlight: true,
		hint: true,
		minLength: 1
	}, {
	    displayKey: 'value',
	    source: terms.ttAdapter()
	});
	
	var selectionHandler = function (eventObject, suggestionObject, suggestionDataset) {
		loadSearchPage();
	};
	
	$('#searchInput').on('typeahead:selected', selectionHandler);
	
	//keypress event handler
	$('#searchInput').keypress( function(e){
		
		if(e.which == 13){
			loadSearchPage();	
			$.blockUI({ message: '<h1>Loading...<img src="'+loading_waiter_url+'"/></h1>'});		
		}

	});
	
	
 	$('#index_query1').qtip({
        content: {
           text: $('#index_query1').next('.tooltiptext'),
		title: false,
		button: false
        },
       position: {
           my: 'top right',
           at: 'bottom center'
       },
	
       hide: {
           delay:100
       },
       events: {
           
       },
	style:{
		classes:"qtip-bootstrap",
	}
    });
	
	
 	$('#index_query2').qtip({
        content: {
           text: $('#index_query2').next('.tooltiptext'),
		title: false,
		button: false
        },
       position: {
           my: 'top right',
           at: 'bottom center'
       },
	
       hide: {
           delay:100
       },
       events: {
           
       },
	style:{
		classes:"qtip-bootstrap",
	}
    });
	
	
 	$('#index_query3').qtip({
        content: {
           text: $('#index_query3').next('.tooltiptext'),
		title: false,
		button: false
        },
       position: {
           my: 'top right',
           at: 'bottom center'
       },
	
       hide: {
           delay:100
       },
       events: {
           
       },
	style:{
		classes:"qtip-bootstrap",
	}
    });

};


