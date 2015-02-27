function Interaction(queryURL, detailURL, autosuggestURL, sourceURL, loading_waiter_url , query) {

	this.queryProcessor = new Processor();
	this.source_url = sourceURL;
	this.base_detail_url = detailURL;
	this.base_query_url = queryURL;
	this.autosuggest_url = autosuggestURL
	this.initialQuery = query;
	this.autosuggest_acp = "term";
	this.loading_waiter_url = loading_waiter_url ;

	this.queryProcessor.setBaseURL(this.base_detail_url);
	this.queryProcessor.setQueryURL(this.base_query_url);
	this.queryProcessor.setAutosuggestURL(this.autosuggest_url);
	this.queryProcessor.setSourceURL(this.source_url);
	this.queryProcessor.setLoaderURL(this.loading_waiter_url);
	
};

Interaction.prototype.setQuery = function(query){
	this.queryProcessor.setQuery(query);
};

Interaction.prototype.initialise = function() {
	this.setQuery(this.initialQuery);
	this.queryProcessor.loadJSON();
	
	//initialise facets and generic search input field
	$("#filters").tagsInput({
		 'interactive':false
	});

	var terms = new Bloodhound({
	    datumTokenizer: function (datum) {
	        return Bloodhound.tokenizers.whitespace(datum.value);
	    },
	    queryTokenizer: Bloodhound.tokenizers.whitespace,
	    remote: {
	        url: this.autosuggest_url + "?"+ this.autosuggest_acp + "=" + '%QUERY',
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
	
	//initialise configuration buttons
	var gridButton = "#gridButton";
	var tableButton = "#listButton";
	var displayDiv = "#searchresults";
	var tabResults;
	var gridResults;

	$('#gridButton,#listButton').click(function() {
	    var ix = $(this).index();
	
	    $('#gridresults').toggle( ix === 0 );
	    $('#tableresults').toggle( ix === 1 );
		
		if( ix == 0){
			$(tableButton).removeClass('active');
			$(gridButton).addClass('active');
		}else{
			$(gridButton).removeClass('active');
			$(tableButton).addClass('active');
		}
		
		return false;
	});
	
}

Interaction.prototype.actionOnAddTagfunction = function(tag) {
	//implement function with addition action for tags.
}

Interaction.prototype.actionOnRemoveTagfunction = function(tag) {
	//implement function for removal of tags.
}

Interaction.prototype.loadJSON = function(){
		this.queryProcessor.loadJSON();
}

Interaction.prototype.autosuggestTest = function(){
	
 	var queryParams = {};
	queryParams.term = $("#searchInput").val();
	
	var autosuggestURL = "getAutosuggest";
	
	$.getJSON(base_query_url + autosuggestURL, queryParams,
		function(data, textStatus, jqXHR){
			//display_data = data;
			//console.log("Data from server = "+ display_data);

		}
	);


}

function hideGrid(){
		//
}

function showGrid(){
		//
};

function hideTable(){
		//
};

function showTable(){
		//
};