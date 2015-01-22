function Interaction(queryURL, detailURL, autosuggestURL) {

	this.queryProcessor = new Processor();
	this.base_detail_url = detailURL;
	this.base_query_url = queryURL;
	this.autosuggest_url = autosuggestURL

	this.autosuggest_acp = "term";

	this.queryProcessor.setBaseURL(this.base_detail_url);
	this.queryProcessor.setQueryURL(this.base_query_url);
	this.queryProcessor.setAutosuggestURL(this.autosuggest_url);
	
};

Interaction.prototype.initialise = function() {
	this.queryProcessor.loadJSON();
	
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