 
   $(document).ready(function(){ // Included document.ready to ensure that the DOM elements are loaded before applying the tour facility.
	   
	   var tour_home_page = {
	     id: 'phis-tour-home',
	     steps: [
	      /*  {
	         target: 'phis',
	         title: 'PhenoImageShare!',
	         content: 'Code-named PhIS, PhenoImageShare delivers tools for the annotation, querying, and submission of images (and their regions of interest) stored in distributed databases.',
	         placement: 'left'
	       },
		   */
			  
		   {
  	         target: 'dashboard',
  	         title: 'Dashboard!',
  	         content: 'Presents visual summaries of the PhenoImageShare dataset.',
  	         placement: 'bottom',
		     yOffset: -100,
			 xOffset: 500,
			    height: 50,
	   	   },
		   
	      /* {
	         target: 'searchMenuItem',
	         title: 'Searching & Querying',
	         content: 'PhenoImageShare provides tools for searching & querying the PhIS repository [of metadata] of images for their phenotypical and anatomical annotations, thereby allowing for answering competency questions of interest.',
	         placement: 'bottom',
	       },
			  */
	       {
	         target: 'searchMenuItem',
	         title: 'Searching & Querying',
	         content: 'PhenoImageShare enables querying of complex annotations and metadata related to bio-images.',
	         placement: 'bottom',
	       },
		   
	      /* {
	         target: 'submissionMenuItem',
	         title: 'Submission Service',
	         content: 'PhenoImageShare provides submission tool for users to submit new images and associated annotations to the PhIS repository for indexing and querying by a wider community.',
	         placement: 'bottom',
	       },
		   
			  
	       {
	         target: 'submissionMenuItem',
	         title: 'Submission Service',
	         content: 'PhenoImageShare provides a submission tool to allow users to register new image instances (i.e. image metadata and annotaitons).',
	         placement: 'bottom',
	       },
			  
		   
	      /* {
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
	       },*/
	     /*  {
	         target: 'loginButton',
	         title: 'Do you wish to share your annotations ?',
	         content: 'User management facility is provided by PhenoImageShare to allow users to log in and submit new images, metadata and annotations. Login and/or registration are not required to search and query the PhIS database.',
	         placement: 'bottom',
		     xOffset: -150,
			 arrowOffset: 170
	       },
	       {
	         target: 'registerButton',
	         title: 'Are you a registered user ?',
	         content: 'Registration facility is provided by PhIS for unique identification of users submitting and annotating images. Registration is not required to search and query the PhIS database.',
	         placement: 'bottom',
		     xOffset: -200,
			 arrowOffset: 230
	       },
		  
	       {
	         target: 'registerButton',
	         title: 'Are you a registered user ?',
	         content: 'To add/edit annotations you must be a registered user.  You can register/login here.',
	         placement: 'bottom',
		     xOffset: -200,
			 arrowOffset: 230
	       },
	     
		 /*  {
	         target: 'freetextLabel',
	         title: 'What\'s Next ?',
	         content: 'Try out PhenoImageShare\'s search and query tool for a start. Enter a freetext and push the search button or click on the next button here - and you\'re all set to go !',
			 placement: 'bottom',
	         multipage: true,
	         onNext: function() {
	           window.location = "/search/"
	         }

	       },
		   */
	       {
	         target: 'indexInput',
	         title: 'Perform search',
	         content: 'You can discover images by searching for genes, anatomy or phenotype terms.',
			 placement: 'bottom',
	         multipage: true,
	         onNext: function() {
	           window.location = "/search/"
	         },
			 width: 300,
	       },

	       {
	         target: 'imgtable',
	         title: 'Results panel',
	         content: 'A list of the images matching your search.',
			 placement: 'left',
			 width: 300,
		     yOffset: -50,
	       },

	       {
	         target: 'imgtable',
	         title: 'Quick filter',
	         content: 'Quickly filter the results, e.g., enter \'Gtf3c5\' to see images related to the gene Gtf3c5.',
			 placement: 'left',
			 width: 300,
		     yOffset: -70,
			 xOffset: 600,
	       },

	       {
	         target: 'tour-placeholder',
	         title: 'Browsing results',
	         content: 'Results are paginated and navigation can be peformed by easy-to-use controls.',
			 placement: 'left',
		     yOffset: -70,
			 xOffset: 200,
	       },
		   
	       {
	         target: 'facetsTab',
	         title: 'Detailed filters',
	         content: 'A more comprehensive range of filters that allow you to reduce the set of images in your results panel.',
			 placement: 'right',
			 width: 300
	       },

	       {
	         target: 'imgtable',
	         title: 'Individual result',
	         content: 'Each result is an image. You can see a summary of that image\'s annotations. For more detail click on the image.',
			 placement: 'left',
			 width: 300,
		     yOffset: 80,
			 multipage: true,
  	         onNext: function() {
  	           window.location = "/search/detail/?q=&imageId=wtsi_komp2_112968"
  	         },
  			 width: 300,
	       },
		   /*
	       {
	         target: 'searchInput',
	         title: 'Enjoy your search',
	         content: 'You may now enter freetext and push the search button for a fresh search !',
			 placement: 'bottom',
		     yOffset: 0,
			 xOffset: 0,
	       }
		   */
		   
	       {
	         target: 'imagecanvass',
	         title: 'Annotated Image',
	         content: 'Image showing the annotated Regions of Interest (ROIs).',
			 placement: 'right',
			 width: 300
	       },
		   
	       {
	         target: 'imagemetadata',
	         title: 'Metadata',
	         content: 'Metadata associated with this image including genotype information.',
			 placement: 'left',
			 width: 300,
	   	     yOffset: 22,
	       },
		   
	       {
	         target: 'imagerois',
	         title: 'ROIs Annotations',
	         content: 'Table listing the image\'s annotations; click on a row for more detailed information.',
			 placement: 'left',
			 width: 300,
			 yOffset: 50,
			/* multipage: true,
	         onNext: function() {
	           window.location = "/annotation/?q=&img=komp2_112968"
	         },*/
	       },
		   
	      /* {
	         target: 'viewer',
	         title: 'Image viewer',
	         content: 'Image viewer',
			 placement: 'left',
			 width: 300
	       },
		   */
		   
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
			 
			// console.log("Hopstoch state: "+ state);
			 
	     if (state === 'phis-tour-home:3') {
	       // Already started the tour at some point!
	       hopscotch.startTour(tour_home_page);
	     } else if (state === 'phis-tour-home:8') {
	     	 hopscotch.startTour(tour_home_page);
	     }
		/* else if (state === 'phis-tour-search:11') {
		 	 hopscotch.startTour(tour_home_page);
		 }	 */
	     else {
	       // Landing on the PhIS Index page for the first(?) time.
			  var tourButton = document.getElementById(startBtnId);
	       setTimeout(function() {
			   
			   if (tourButton){
	  	         mgr.createCallout({
	  				 id: calloutId,
	  	             title: "What is PhenoImageShare ?",
	  	             content: "Let's take a tour of PhenoImageShare tool.",
	  	             target: startBtnId,
	  	             placement: "bottom",
	  	         	 yOffset: -5,
	  				 xOffset: -70,
	  	           	 arrowOffset: 100,
	  	           	 width: 240
	  	         });
			   }

	       }, 100);
	     }
	 	
		
		 
		 if (tourButton){
		     addClickListener(tourButton, function() {
		       if (!hopscotch.isActive) {
		         mgr.removeAllCallouts();
		         hopscotch.startTour(tour_home_page);
		       }
		     });
		 
		}else {
   	     if (state === 'phis-tour-home:3') {
   	       // Already started the tour at some point!
   	       hopscotch.startTour(tour_home_page);
   	     }
		 else if (state === 'phis-tour-home:8') {
			    hopscotch.startTour(tour_home_page);
		 }
		/* else if (state === 'phis-tour-home:11') {
			    hopscotch.startTour(tour_home_page);
		 }*/
		}
	     
	   };

	   init();
          
   }); //End of document loading.
   
  
   