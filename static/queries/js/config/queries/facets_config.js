/**
 * Copyright © 2014 MRC - Human Genetics Unit, Edinburgh.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * searchAndFacetConfig: definition of variables for the search and facet 
 * see searchAndFacet directory
 * 
 * Author: Solomon Adebayo.
 * 
 */
 
 
 if ( typeof $ === 'undefined'){
 	$ = window.jQuery;
 }

 if(typeof(window.PhIS) === 'undefined') {
     window.PhIS = {};
 }

 PhIS.searchAndFacetConfig = {};
 var config = PhIS.searchAndFacetConfig;

 config.currentQuery    = false;
 config.matchedFacet = false;
 config.facetOpen   = false;
 config.pageReload   = false;
 config.changeFilter = false;
 config.backButton   = false;
 
 
 config.topLevelFacets = ['expression', 'phenotype', 'stage', 'anatomy', 'gene', 'platform', 'level'];
 
 config.phenotypeSubFacets = {};

 config.geneSubFacets = {};
 
 config.expressionSubFacets = {};

 config.stageSubFacets = {};
 
 config.anatomySubFacets = {};
 
 config.platformSubFacets = {};
 
 config.levelSubFacets = {};
 
 
 //Fields to Facets conversion
 config.fields2facets = {};
 
 //Labels for the facet filters
 config.filterLabels = {}; 
 
 //parameters common to all filters
 var commonParams = {					
 		'qf': 'auto_suggest',
 		'defType': 'edismax',
 		'start': 0
 };
 
 //set parameters as configuration
 config.queryParamsIQS = commonParams;
 
 
 //define facet specific parameters for query.
 config.facetParams = {
	 'anatomy':{},
	 'gene':{},
	 'phenotype':{},
	 'image':{},
	 'expression';{},
	 'stage':{},
	 'platform':{}	 
 };