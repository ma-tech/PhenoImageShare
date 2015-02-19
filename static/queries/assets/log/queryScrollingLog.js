/* =========================================================
 * bootstrap-query-historic.js v1.0.0
 * =========================================================
 * Copyright 2015 Solomon Adebayo 

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

	var pluginName = 'historic';

	var QueryHistoric = function(element, options) {
		
		this.$element = $(element);
		this._element = element;
		this._elementId = this._element.id;
		this._styleId = this._elementId + '-style';

		this.historyDisplay = [];
		this.historyData = [];
				
		this._init(options);
	};

	QueryHistoric.defaults = {
		option1:undefined
	};

	QueryHistoric.prototype = {

		remove: function() {

			this._destroy();
			$.removeData(this, 'plugin_' + pluginName);
			$('#' + this._styleId).remove();
		},

		_destroy: function() {

			if (this.initialized) {
				this.$wrapper.remove();
				this.$wrapper = null;

			}

			// Reset initialized flag
			this.initialized = false;
		},

		_init: function(options) {
			
			this.historyData = options.data;
			this._destroy();
			this._render();
		},

		_appendBookmarkHandler: function(buttonId){
			//console.log("Bookmark button Id;"+ buttonId);
			
	        $('#'+buttonId).click(function() {
	            if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
	                window.sidebar.addPanel(document.title,window.location.href,'');
	            } else if(window.external && ('AddFavorite' in window.external)) { // IE Favorite
	                window.external.AddFavorite(location.href,document.title); 
	            } else if(window.opera && window.print) { // Opera Hotlist
	                this.title=document.title;
	                return true;
	            } else { // webkit - safari/chrome
	                alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
	            }
	        });
		},

		_render: function() {
			
			var self = this;

			if (!self.initialized) {

				// Setup first time only components
				self.$element.addClass(pluginName);
				
				self.$wrapper = $(self._template.list);
			
				self.initialized = true;
			}
			
			self.$element.empty().append(self.$wrapper.empty());

			self._buildHistory(self.historyData);
			
		},
		
		// Starting from the root node, and recursing down the 
		// structure we build the tree one node at a time
		_buildHistory: function(data) {
			
			var self = this;
	
			$.each(data, function addEntry(id, entry) {
				
				var historyItem = $(self._template.item).html(entry.query)
					.append($(self._template.linebreak))
					.append($(self._template.queryButton).attr('id','viewQuery'+id+'Button').attr('data-target','#urlHolder'+id))
					.append($(self._template.bookmarkButton).attr('id','bookmarkQueryButton'+id))
					.append($(self._template.urlHolder).attr('id','urlHolder'+id).html(entry.url))
					.append($(self._template.shareButtonHolder)
					.append($(self._template.shareButton)))
				
				// Add item to the tree
				self.$wrapper.append(historyItem);
				self._appendBookmarkHandler('bookmarkQueryButton'+id);
				
				var config = {
					url: entry.url
				};
				
				new Share(".share-button", config);
				
			});
			
						

			
		},

		_template: {
			list: '<ul class="list-group"></ul>',
			item: '<li class="list-group-item"></li>',
			container1:'<div class="panel-group" id="query_history_accordion"></div>',
			container2:'<div class="panel panel-primary"></div>',
			container3:'<div id="query_history" class="panel-collapse collapse in"></div>',
			panelHeading:'<div class="panel-heading"></div>',
			header:'<h3 id="queryHistoryID" class="panel-title"></h3>',
			headerLink:'<a data-toggle="collapse" data-parent="#query_history_accordion" href="#query_history">History</a>',
			queryButton:'<button type="button" id="viewQueryButton" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" data-clipboard-text="URL to copy!" class="btn btn-xs btn-primary">View query</button>',
			bookmarkButton:'<button type="button" id="bookmarkQueryButton" class="btn btn-xs btn-primary">Bookmark query</button>',
			urlHolder:'<div class="collapse"  style="font-size:10px"></div>',
			urlModal:'<div id="modal_id" class="modal fade" tabindex="-1" data-width="500" style="display: none;"></div>',
			shareButton:'<button type="button" id="searchButton" class="btn btn-xs btn-primary "></button>',
			shareButtonHolder:'<div class="share-button" style="display:inline;"></div>',
			linebreak:'<br/>',
			urlText:'<p style="font-size:20px></p>',
			font:'<font size="1"></font>'
		},

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
					$.data(this, 'plugin_' + pluginName, new QueryHistoric(this, $.extend(true, {}, options)));
				}
				else {
					self._init(options);
				}
			}
			
			
		});
	};

})(jQuery, window, document);