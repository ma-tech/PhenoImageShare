 
   $(document).ready(function(){ // Included document.ready to ensure that the DOM elements are loaded before applying the tour facility.
	   
	   var tour = {
	     id: 'phis-tour',
	     steps: [
	       {
	         target: 'phis',
	         title: 'PhenoImageShare!',
	         content: 'Code-named PhIS, Phenoimageshare delivers tools for annotating, querying, storing, and submitting of images (and their associated medata) across distributed databases.',
	         placement: 'left'
	       },
	       {
	         target: 'searchMenuItem',
	         title: 'Searching & Querying',
	         content: 'PhenoImageShare provides tools for searching & querying the PhIS repository of metadata for distributed databases of images for their phenotypical and anatomical annotations, thereby answering certain competency questions of interest.',
	         placement: 'bottom',
	       },
	       {
	         target: 'submissionMenuItem',
	         title: 'Submission Service',
	         content: 'PhenoImageShare provides tool users to submit new images and their associated annotations to the PhIS repository for indexing and querying by a wider community.',
	         placement: 'bottom',
	       },
	       {
	         target: 'glossaryMenuItem',
	         title: 'Glossary',
	         content: 'PhenoImageShare mantains a dictionary of the various types of image medata and annotations indexed within the PhIS repository.',
 	         placement: 'bottom'
	       },
	       {
	         target: 'aboutPhISMenuItem',
	         title: 'Every other thing',
	         content: 'We provide information about every other thing you need to know about PhenoImageShare project and it\'s development.',
	         placement: 'bottom',
	       },
	       {
	         target: 'loginButton',
	         title: 'Do you wish to share your annotations ?',
	         content: 'PhenoImageShare provides user management facility to allow users to log in and submit new images, metadata and annotations. Login and/or registration are not required to search and query the PhIS database.',
	         placement: 'bottom',
		     xOffset: -150,
			 arrowOffset: 170
	       },
	       {
	         target: 'registerButton',
	         title: 'Are you a registered user ?',
	         content: 'PhenoImageShare provides user registration facility to allow for unique identification of users performing operations such as annotations, submission of images, etc. Registration is not required to search and query the PhIS database.',
	         placement: 'bottom',
		     xOffset: -200,
			 arrowOffset: 230
	       },
	       {
	         target: 'freetextLabel',
	         title: 'What\'s Next ?',
	         content: 'Try out PhenoImageShare\'s search and query tool for a start. Enter a freetext and push the search button - and you\'re all set to go !',
			 placement: 'bottom',
	         multipage: true,
	         onNext: function() {
	           window.location = "/search/"
	         }

	       },
	       {
	         target: 'facetsTab',
	         title: 'Results facets',
	         content: 'PhenoImageShare provides faceted view of the indexed data for ease of search and navigation',
			 placement: 'left',
			 width: 200
	       },
	       {
	         target: 'imgtable',
	         title: 'Results / Hits',
	         content: 'Search results hits containing the images matching the search text and/or selected facets',
			 placement: 'left',
			 width: 300,
		     yOffset: -100,
	       },
	       {
	         target: 'imgtable',
	         title: 'Searching the results',
	         content: 'Further search can be performed on the results by use of the table search box. E.g. enter \'Gtf3c5\' to view records linked with gene Gtf3c5 ',
			 placement: 'right',
			 width: 300,
		     yOffset: -60,
			 xOffset: -80,
	       },
	       {
	         target: 'tour-placeholder',
	         title: 'Browsing results',
	         content: 'Results are paginated and navigation can be beformed by the provided easy-to-use controls.',
			 placement: 'right',
		     yOffset: -120,
			 xOffset: -70,
	       },
	       {
	         target: 'imgtable',
	         title: 'Navigating to detailed view',
	         content: 'Click on the image icon to navigate to the detailed view of the image',
			 placement: 'left',
			 width: 300,
		     yOffset: 80,
	       },
	       {
	         target: 'searchInput',
	         title: 'Enjoy your search',
	         content: 'You can now enter freetext and push the search button for a fresh search !',
			 placement: 'bottom',
		     yOffset: 0,
			 xOffset: 0,
	       }
		   
	     ],
	     showPrevButton: true,
	     scrollTopMargin: 100
	   },

	   /* ========== */
	   /* TOUR SETUP */
	   /* ========== */
	   addClickListener = function(el, fn) {
	     if (el.addEventListener) {
	       el.addEventListener('click', fn, false);
	     }
	     else {
	       el.attachEvent('onclick', fn);
	     }
	   },

	   init = function() {
	     var startBtnId = 'tourButton',
	         calloutId = 'startTourCallout',
	         mgr = hopscotch.getCalloutManager(),
	         state = hopscotch.getState();
			 
			 console.log("Hopstoch state: "+ state);
			 
	     if (state === 'phis-tour:8') {
	       // Already started the tour at some point!
	       hopscotch.startTour(tour);
	     }
	     else {
	       // Landing on the PhIS Index page for the first(?) time.
	       setTimeout(function() {
	         mgr.createCallout({
				 id: calloutId,
	             title: "What is PhenoImageShare ?",
	             content: "Let's start by taking a tour of the PhenoImageShare tool.",
	             target: startBtnId,
	             placement: "right",
	         	 yOffset: -25,
	           	 arrowOffset: 20,
	           	 width: 240
	         });
	       }, 100);
	     }
	 	
		 var tourButton = document.getElementById(startBtnId);
		 
		 if (tourButton){
		     addClickListener(tourButton, function() {
		       if (!hopscotch.isActive) {
		         mgr.removeAllCallouts();
		         hopscotch.startTour(tour);
		       }
		     });
		 
		}else {
   	     if (state === 'phis-tour:8') {
   	       // Already started the tour at some point!
   	       hopscotch.startTour(tour);
   	     }
		}
	     
	   };

	   init();
          
   }); //End of document loading.
   
  
   