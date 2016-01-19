/* =========================================================
 * bootstrap-treeview.js v1.0.0
 * =========================================================
 * Copyright 2013 Jonathan Miles 
 * Project URL : http://www.jondmiles.com/bootstrap-treeview
 *	
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

;(function($, window, document, undefined) {

	/*global jQuery, console*/

	'use strict';

	var pluginName = 'treeview';

	var Tree = function(element, options) {
		
		this.$element = $(element);
		this._element = element;
		this._elementId = this._element.id;
		this._styleId = this._elementId + '-style';

		this.tree = [];
		this.query = {};
		this.nodes = [];
		this.selectedNode = {};
		this.objects = [];
		
		this.base_detail_url = "";
		this.base_query_url = "";
		this.autosuggest_url = "";
		
		this.facet_input_field_trigger = false;

		//Autosuggest endpoint mappings
		this.autosuggest_mappings = {"PhenotypeButtonField":"PHENOTYPE", "AnatomyButtonField":"ANATOMY", "GeneButtonField":"GENE"}

		this._init(options);
	};

	Tree.defaults = {

		injectStyle: true,

		levels: 1,

		expandIcon: 'glyphicon glyphicon-plus-sign',
		collapseIcon: 'glyphicon glyphicon-minus-sign',
		emptyIcon: 'glyphicon',
		nodeIcon: 'glyphicon glyphicon-stop',

		color: undefined, // '#000000',
		backColor: undefined, // '#FFFFFF',
		borderColor: undefined, // '#dddddd',
		onhoverColor: '#F5F5F5',
		selectedColor: '#FFFFFF',
		selectedBackColor: '#428bca',

		enableLinks: false,
		highlightSelected: true,
		showBorder: true,
		showTags: false,

		// Event handler for when a node is selected
		onNodeSelected: undefined
	};

	Tree.prototype = {

		remove: function() {

			this._destroy();
			$.removeData(this, 'plugin_' + pluginName);
			$('#' + this._styleId).remove();
		},

		_destroy: function() {

			if (this.initialized) {
				this.$wrapper.remove();
				this.$wrapper = null;

				// Switch off events
				this._unsubscribeEvents();
			}

			// Reset initialized flag
			this.initialized = false;
		},

		_init: function(options) {
		
			if (options.data) {
				if (typeof options.data === 'string') {
					options.data = $.parseJSON(options.data);
					
				}
				
				this.tree = $.extend(true, {}, options.data.facet_data);
				this.query = options.data.query;
				this.base_detail_url = options.detail_page_url;;
				this.base_query_url = options.query_page_url;
				this.autosuggest_url = autosuggest_url;
				
				delete options.data;
			}

			this.options = $.extend({}, Tree.defaults, options);
			
			this._setInitialLevels(this.tree, 0);

			this._destroy();
			this._subscribeEvents();
			this._render();
		},

		_unsubscribeEvents: function() {

			this.$element.off('click');
		},

		_subscribeEvents: function() {

			this._unsubscribeEvents();

			this.$element.on('click', $.proxy(this._clickHandler, this));
			//this.$element.on('keypress', $.proxy(this._keypressHandler, this));
			
			if (typeof (this.options.onNodeSelected) == 'function') {
				this.$element.on('nodeSelected', this.options.onNodeSelected);
			}
		},
		
		_keypressHandler: function(event) {
				if(event.which == 13){
						//console.log("Key is now pressed");	
						this._clickHandler(event);	
				}

		},
			
		_clickHandler: function(event) {
			
			if (!this.options.enableLinks) { event.preventDefault();}
			
			var target = $(event.target),
				classList = target.attr('class') ? target.attr('class').split(' ') : [],
				node = this._findNode(target);
			
			//console.log("Called click handler, Node parent = " + node.parent);
			
			if (node.parent == "Anatomy" || node.parent == "Gene" || node.parent == "Phenotype"){
				//perform some operations here, knowing the we've selected a search field.
				this._prepareQueryForInputFields(event, node, target);
				
			}
			else {
				if ((classList.indexOf('click-expand') != -1) ||
						(classList.indexOf('click-collapse') != -1)) {
	
					// Expand or collapse node by toggling child node visibility
					this._toggleNodes(node);
					this._render();
				}
				else if (node) {
					if (this._isSelectable(node)) {
						this._setSelectedNode(node);
					} else {
						this._toggleNodes(node);
						this._render();
					}
					
					this._prepareQueryForCheckboxFields(event, node);
		
				
					if (this._isEndNode(node)){
						//this._toggleCheckbox(node);
					}
				}
			}
			
		},
		
		_prepareQueryForInputFields: function(event, node, target){
			this.query = node.query;
			
			//verify that button is clicked
			if (target.attr('type') == "button" || (target.attr('type') == "text" && this.facet_input_field_trigger)){
				
				this.facet_input_field_trigger = false;
				
				//collect values from fields
				var geneField = $('#GeneButtonField');
				var anatomyField = $('#AnatomyButtonField');
				var phenotypeField = $('#PhenotypeButtonField');
				
				if (geneField.val() && geneField.val() != "")
					this.query.Gene.value = geneField.val();
				else
					this.query.Gene.value = "";
				
				if (anatomyField.val() && anatomyField.val() != ""){
					//alert(anatomyField.val());
					this.query.Anatomy.value = anatomyField.val();
				}
				else
					this.query.Anatomy.value = "";
				
				if (phenotypeField.val() && phenotypeField.val() != "")
					this.query.Phenotype.value = phenotypeField.val();
				else
					this.query.Phenotype.value = "";
				
				//pass the query on (query passing concept)
				node.query = this.query;
				this.options.onNodeSelected(event, node);
				
			}else if(target.attr('type') == "text"){
				//if(event.which == 13){}
				return;
			}else{
				return;
			}
		},
		
		_prepareQueryForCheckboxFields: function(event, node){
			
			if (typeof (this.options.onNodeSelected) == 'function' && !(node.nodes != undefined || node._nodes != undefined) ){
				var EXPANDED = true;
				var COLLAPSED = false;
			
				this.query.expanded[node.parent] = EXPANDED;
				
				if (!node.checked) {
					if (node.sampleType != undefined) {
						this.query.imageType = node.queryText;
						this.query.sampleType = node.sampleType;
					
					}else if (node.parent == "Species"){
						this.query.taxon[node.text] = node.queryText;
						this.query.taxon.expanded = EXPANDED;
						this.query.taxon.value = node.queryText;
					} else if (node.parent == "Imaging Method"){
						this.query.imagingMethod[node.text] = node.queryText;
						this.query.imagingMethod.expanded = EXPANDED;
						this.query.imagingMethod.value = node.queryText;
					}else if (node.parent == "Stage"){
						this.query.stage_facet[node.text] = node.queryText;
						this.query.stage_facet.expanded = EXPANDED;
						this.query.stage_facet.value = node.queryText;
					}else if (node.parent == "Sources"){
						this.query.source[node.text] = node.queryText;
						this.query.source.expanded = EXPANDED;
						this.query.source.value = node.queryText;
					}else if (node.parent == "Resource"){
						this.query.hostName[node.text] = node.queryText;
						this.query.hostName.expanded = EXPANDED;
						this.query.hostName.value = node.queryText;
					}
				}else{
					if (node.sampleType != undefined) {
						this.query.imageType = "";
						this.query.sampleType = "";
					}else if (node.parent == "Species"){
						this.query.taxon[node.text] = "";
						this.query.taxon.value = "";
						//this.query.taxon.expanded = COLLAPSED;
					} else if (node.parent == "Imaging Method"){
						this.query.imagingMethod[node.text] = "";
						this.query.imagingMethod.value = "";
						//this.query.imagingMethod.expanded = COLLAPSED;
					}else if (node.parent = "Stage"){
						this.query.stage_facet[node.text] = "";
						this.query.stage_facet.value = "";
						//this.query.stage.expanded = COLLAPSED;
					}else if (node.parent = "Sources"){
						this.query.source[node.text] = "";
						this.query.source.value = "";
						//this.query.stage.expanded = COLLAPSED;
					}else if (node.parent = "Resource"){
						this.query.hostName[node.text] = "";
						this.query.hostName.value = "";
						//this.query.stage.expanded = COLLAPSED;
					}
				
				}
				
				//console.log(node);
				
				node.query = this.query;
				this.options.onNodeSelected(event, node);
			}
		},
		
		//Looks up the node for the input or button element.
		_getElementInNode: function(target) {
			
		},
		
		// Looks up the DOM for the closest parent list item to retrieve the 
		// data attribute nodeid, which is used to lookup the node in the flattened structure.
		_findNode: function(target) {
		
			var nodeId = target.closest('li.list-group-item').attr('data-nodeid'),
				node = this.nodes[nodeId];

			if (!node) {
				console.log('Error: node does not exist');
			}
			
			return node;
		},

		_appendAutosuggest: function(element, endpoint){
			var self = this;
			var anatomyterms = new Bloodhound({
			    datumTokenizer: function (datum) {
			        return Bloodhound.tokenizers.whitespace(datum.value);
			    },
			    queryTokenizer: Bloodhound.tokenizers.whitespace,
			    remote: {
			        url: this.autosuggest_url + "?"+ endpoint + "=" + '%QUERY'+ "&type=" + this.autosuggest_mappings[element],
			        filter: function (data) {
			            return $.map(data, function (term) {
			                return {
			                    value: term
			                };
			            });
			        }
			    }
			});
						
			anatomyterms.initialize();
		
			$('#'+element).typeahead({
				highlight: true,
				hint: true,
				minLength: 1
			}, {
			    displayKey: 'value',
			    source: anatomyterms.ttAdapter()
			});
			
			//Code for click event on autosuggest
			var selectionHandler = function (eventObject, suggestionObject, suggestionDataset) {
			var target = $(eventObject.target),
				classList = target.attr('class') ? target.attr('class').split(' ') : [],
				node = self._findNode(target);
			
				self.facet_input_field_trigger = true;
				
				self._prepareQueryForInputFields(eventObject, node, target);
			};
			
			$('#'+element).on('typeahead:selected', selectionHandler);
			$('#'+element).keypress( function(event){
				
				if(event.which == 13){
					var target = $(event.target),
					classList = target.attr('class') ? target.attr('class').split(' ') : [],
					node = self._findNode(target);
			
					self.facet_input_field_trigger = true;
					self._prepareQueryForInputFields(event, node, target);	
				}
				
			});
			
			
		},
		
		/*
		_appendKeyPressEvent: function(element){
			$('#'+element).keypress( function(){
				loadJSON();

			});
		
			
		},*/	
		
		/*
		//append facet search field button click event
		_appendButtonClickEvent: function(buttonID, fieldID, self){
			console.log("Adding buttonID, "+ buttonID + " some click event");
			var associatedFieldID = fieldID;
			//var query = this.query;
			
			$('#'+buttonID).on('click', $.proxy(self._buttonClickEventHandler, self));
		},

		_buttonClickEventHandler: function(buttonID, fieldID, self){
			
		}
		*/
		
		// Actually triggers the nodeSelected event
		_triggerNodeSelectedEvent: function(node) {
			this.$element.trigger('nodeSelected', [$.extend(true, {}, node)]);
			this._render();
		},

		// Handles selecting and unselecting of nodes, 
		// as well as determining whether or not to trigger the nodeSelected event
		_setSelectedNode: function(node) {

			if (!node) { return; }
			
			if (node === this.selectedNode) {
				this.selectedNode = {};
			}
			else {
				this._triggerNodeSelectedEvent(this.selectedNode = node);
			}
			
			this._render();
		},

		// On initialization recurses the entire tree structure 
		// setting expanded / collapsed states based on initial levels
		_setInitialLevels: function(nodes, level) {

			if (!nodes) { return; }
			level += 1;

			var self = this;
			$.each(nodes, function addNodes(id, node) {
				
				if (level >= self.options.levels) {
					self._toggleNodes(node);
					
				}

				// Need to traverse both nodes and _nodes to ensure 
				// all levels collapsed beyond levels
				var nodes = node.nodes ? node.nodes : node._nodes ? node._nodes : undefined;
				if (nodes) {
					return self._setInitialLevels(nodes, level);
				}
			});
		},

		// Toggle renaming nodes -> _nodes, _nodes -> nodes
		// to simulate expanding or collapsing a node.
		_toggleNodes: function(node) {

			if (!node.nodes && !node._nodes) {
				return;
			}

			if (node.nodes) {
				node._nodes = node.nodes;
				delete node.nodes;
			}
			else {
				node.nodes = node._nodes;
				delete node._nodes;
			}
			
			if($('#AnatomyButtonField').val() && $('#AnatomyButtonField').val() != "")
				this.query.Anatomy.value = $('#AnatomyButtonField').val();			
			if($('#PhenotypeButtonField').val() && $('#PhenotypeButtonField').val() != "")
				this.query.Phenotype.value = $('#PhenotypeButtonField').val();
			if($('#GeneButtonField').val() && $('#GeneButtonField').val() != "")
				this.query.Gene.value = $('#GeneButtonField').val();
		},
		
		
		// Returns true if the node is endnode: this is an hack.
		_isEndNode: function (node) {
			return node.endnode;
		},
		
		// Returns true if the node is selectable in the tree
		_isSelectable: function (node) {
			return node.selectable !== false;
		},

		_render: function() {

			var self = this;

			if (!self.initialized) {

				// Setup first time only components
				self.$element.addClass(pluginName);
				
				self.$wrapper = $(self._template.list);

				self._injectStyle();
				
				self.initialized = true;
			}

			self.$element.empty().append(self.$wrapper.empty());

			// Build tree
			self.nodes = [];

			self._buildTree(self.tree, 0);
		},
		
		// Starting from the root node, and recursing down the 
		// structure we build the tree one node at a time
		_buildTree: function(nodes, level) {

			if (!nodes) { return; }
			level += 1;

			var self = this;
			$.each(nodes, function addNodes(id, node) {

				node.nodeId = self.nodes.length;
				self.nodes.push(node);

				var treeItem = $(self._template.item)
					.addClass('node-' + self._elementId)
					.addClass((node === self.selectedNode) ? 'node-selected' : '')
					.attr('data-nodeid', node.nodeId)
					.attr('style', self._buildStyleOverride(node));

				
				// Add text
				if (self.options.enableLinks) {
					// Add hyperlink
					treeItem
						.append($(self._template.link)
							.attr('href', node.href)
							.append(node.text)
						);
				}
				else {
					// otherwise build text, checkbox and tag.
					
					if (!node.nodes && !node._nodes){
							if(node.checked) {
								treeItem
									
									.append($(self._template.labelChecked).html(node.text)
										.append($(self._template.spanIcon)
											.append($(self._template.spanIconUnchecked))
												.append($(self._template.spanIconChecked)))
										.append($(self._template.checkboxChecked)))
										.append($(self._template.badge)
											.append(node.tags))
								;
							
							}else {
								
								if (node.textField){
									//build tree elements and field-based nodes
									treeItem	
										
										.append($(self._template.inputGroup)
										.append($(self._template.textField).attr('id',node.parent+'ButtonField').attr('placeholder',node.parent+((node.parent === "Gene") ? ' symbol' : ' term')))									
										.append($(self._template.inputGroupButton)
										.append($(self._template.facetButton).attr('id', node.parent + 'Button')))
									);
								}else{
									treeItem
										.append($(self._template.labelUnChecked).attr('id', node.text+'-'+node.parent+'-'+'Label').html(node.text)
											.append($(self._template.spanIcon)
												.append($(self._template.spanIconUnChecked))
													.append($(self._template.spanIconChecked)))
											.append($(self._template.checkboxUnchecked)))
											.append($(self._template.badge)
												.append(node.tags))
									;
								}

							
							}
					}else{
						
						// Add indent/spacer to mimic tree structure
						for (var i = 0; i < (level - 1); i++) {
							treeItem.append(self._template.indent);
						}
				
						// Add expand, collapse or empty spacer icons 
						// to facilitate tree structure navigation
						if (node._nodes) {
							treeItem
								.append($(self._template.expandCollapseIcon)
									.addClass('click-expand')
									.addClass(self.options.expandIcon)
								);
								
						}
						else if (node.nodes) {
							treeItem
								.append($(self._template.expandCollapseIcon)
									.addClass('click-collapse')
									.addClass(self.options.collapseIcon)
								);
								
						}
						else {
							treeItem
								.append($(self._template.expandCollapseIcon)
									.addClass(self.options.emptyIcon)
								);
						}
				
					
						// Add node icon
						
						treeItem
							.append($(self._template.icon)
						//.addClass(node.icon ? node.icon : self.options.nodeIcon); disabling addition of nodeIcon (glyphicon-stop element)
							);
						
							treeItem
								.append(node.text);
							
							// Add tags as badges
							if (self.options.showTags && node.tags) {
								$.each(node.tags, function addTag(id, tag) {
									treeItem
										.append($(self._template.badge)
											.append(tag)
										);
								});
							}
					}
					
				}

				
				// Add item to the tree
				self.$wrapper.append(treeItem);
				
				if (node.textField){
					var elementID = node.parent + "ButtonField";
					//var elementSearchButton = node.parent + "SearchButton";
					
					self._appendAutosuggest(elementID, node.autosuggestEndpoint);
					//self._appendKeyPressEvent(elementID);
					//self._appendButtonClickEvent(elementSearchButton, elementID, self);
				}
				
				if(self.query != undefined  && self.query.Anatomy.value != "" )
					$('#AnatomyButtonField').val(self.query.Anatomy.value);
				if(self.query != undefined && self.query.Phenotype.value != "" )
					$('#PhenotypeButtonField').val(self.query.Phenotype.value);
				if(self.query != undefined  && self.query.Gene.value != "" )
					$('#GeneButtonField').val(self.query.Gene.value);
				
				// Recursively add child ndoes
				if (node.nodes) {
					return self._buildTree(node.nodes, level);
				}
			});
		},

		// Define any node level style override for
		// 1. selectedNode
		// 2. node|data assigned color overrides
		_buildStyleOverride: function(node) {

			var style = '';
			if (this.options.highlightSelected && (node === this.selectedNode)) {
				style += 'color:' + this.options.selectedColor + ';';
			}
			else if (node.color) {
				style += 'color:' + node.color + ';';
			}

			if (this.options.highlightSelected && (node === this.selectedNode)) {
				style += 'background-color:' + this.options.selectedBackColor + ';';
			}
			else if (node.backColor) {
				style += 'background-color:' + node.backColor + ';';
			}

			return style;
		},

		// Add inline style into head 
		_injectStyle: function() {
			
			if (this.options.injectStyle && !document.getElementById(this._styleId)) {
				$('<style type="text/css" id="' + this._styleId + '"> ' + this._buildStyle() + ' </style>').appendTo('head');
			}
		},

		// Construct trees style based on user options
		_buildStyle: function() {

			var style = '.node-' + this._elementId + '{';
			if (this.options.color) {
				style += 'color:' + this.options.color + ';';
			}
			if (this.options.backColor) {
				style += 'background-color:' + this.options.backColor + ';';
			}
			if (!this.options.showBorder) {
				style += 'border:none;';
			}
			else if (this.options.borderColor) {
				style += 'border:1px solid ' + this.options.borderColor + ';';
			}
			style += '}';

			if (this.options.onhoverColor) {
				style += '.node-' + this._elementId + ':hover{' +
				'background-color:' + this.options.onhoverColor + ';' +
				'}';
			}

			return this._css + style;
		},

		_template: {
			list: '<ul class="list-group"></ul>',
			item: '<li class="list-group-item"></li>',
			indent: '<span class="indent"></span>',
			expandCollapseIcon: '<span class="expand-collapse"></span>',
			icon: '<span class="icon"></span>',
			link: '<a href="#" style="color:inherit;"></a>',
			badge: '<span class="badge"></span>',
			spanIcon: '<span class="icons" style="margin-left:10x;"></span>',
			spanIconChecked: '<span class="second-icon fui-checkbox-checked"></span>',
			spanIconUnChecked: '<span class="first-icon fui-checkbox-unchecked"></span>',
			labelChecked: '<label class="checkbox checked" for="checkboxChecked">Checked</label>',
			labelUnChecked: '<label class="checkbox" for="checkboxUnchecked" style="margin-left:10x;">Unchecked</label>',
			checkboxUnchecked:'<input type="checkbox" value="" id="checkboxUnchecked" data-toggle="checkbox">',
			checkboxChecked:'<input type="checkbox" checked="checked" value="" id="checkboxChecked" data-toggle="checkbox" checked="">',
			textField: '<input type="text" class="form-control col-lg-8 autosuggest" id="anatomyField" placeholder="">',
			inputGroupButton: '<span class="input-group-btn"></scan>',
			inputGroup: '<div class="input-group"></div>',
			facetButton: '<button type="button" id="facetsearchButton" class="btn btn btn-lg-phis-search glyphicon glyphicon-search"></button>',
			inputGroupAddOn: '<span class="input-group-addon">:</span>'
		},

		_css: '.list-group-item{cursor:pointer;}span.indent{margin-left:5px;margin-right:10px}span.expand-collapse{width:1rem;height:1rem}span.icon{margin-left:10x;margin-right:5px}label.checkbox{margin-left:10x;cursor:pointer;display:inline;}'
		// _css: '.list-group-item{cursor:pointer;}.list-group-item:hover{background-color:#f5f5f5;}span.indent{margin-left:10px;margin-right:10px}span.icon{margin-right:5px}'
		
	};

	var logError = function(message) {
        if(window.console) {
            window.console.error(message);
        }
    };

	// Prevent against multiple instantiations,
	// handle updates and method calls
	$.fn[pluginName] = function(options, args) {
		return this.each(function() {
			var self = $.data(this, 'plugin_' + pluginName);
			if (typeof options === 'string') {
				if (!self) {
					logError('Not initialized, can not call method : ' + options);
				}
				else if (!$.isFunction(self[options]) || options.charAt(0) === '_') {
					logError('No such method : ' + options);
				}
				else {
					if (typeof args === 'string') {
						args = [args];
					}
					self[options].apply(self, args);
				}
			}
			else {
				if (!self) {
					$.data(this, 'plugin_' + pluginName, new Tree(this, $.extend(true, {}, options)));
				}
				else {
					self._init(options);
				}
			}
		});
	};

})(jQuery, window, document);