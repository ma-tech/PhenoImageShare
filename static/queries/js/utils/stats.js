function Stats() {
	
	//Single data points stats
	this.stats = {};
	this.imagingMethod = {};
	this.stage = {};
	this.mutants_wildtypes = {};
	this.phenotype_expression = {};
	this.data_sources = {};
	
	//Relationship stats
	this.imagingMethod_sampleType = {};
	this.stage_sampleType = {};
	this.sampleType_imageType = {};
	this.imagingMethod_stage = {};
	
	//raw daa
	this.rawData = "";
	this.query_base_url = "";
	this.echarts_url = "";
	this.queryParams = "";
	this.searchString = "";

};

/**
 * set query URL
*/
Stats.prototype.setQueryURL= function(queryURL) {
	this.query_base_url = queryURL;
};

/**
 * set query URL
*/
Stats.prototype.setEchartsURL= function(echartsURL) {
	this.echarts_url  = echartsURL;
};

/**
 * get query URL
*/
Stats.prototype.getQueryURL= function() {
	return this.query_base_url;
};


/**
 * Render Charts on browser.
*/
Stats.prototype.renderCharts = function() {
	
	//render imaging methods chart
	this.imagingMethodPlot();
	
	//render imaging methods chart
	this.sampleTypePlot();
	
	//render imaging methods chart
	this.imageTypePlot();
	
	//render imaging methods chart
	this.stagePlot();
	
	//relationship between imaging methods and sample types
	//this.imagingMethodSamplePlot();

};


Stats.prototype.renderSTIMCharts = function(){
	//var imagingMethodWildtypeData = this.stats.imagingMethodWildtypeData;
	//var imagingMethodMutantData = this.stats.imagingMethodMutantData;
	var imagingMethodsData = this.stats.imagingMethodsData;
	
	var pieData = [];
	var names = [];
	var barData = {};
	
	//extract and prepare imaging methods data
	for (key in imagingMethodsData){
		names.push(key);
		pieData.name = names;
		
		var data = {};
		
		data.value = imagingMethodsData[key].value;
		data.name = key;
		
		pieData.push(data);
		
		//prepare bar plot data
		var barDataPoint= [this.stats.imagingMethodWiltypeData[key]  ? this.stats.imagingMethodWiltypeData[key].value : 0, this.stats.imagingMethodMutantData[key] ? this.stats.imagingMethodMutantData[key].value  : 0];
		
		barData[key] = barDataPoint;
	}

	
	//Pie chart (imaging methods) options
	pie_options = {
	    title : {
	        text: '',
	        subtext: '',
	        x:'center',
			y:'bottom'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient : 'horizontal',
	        x : 'center',
			y : 'bottom',
			padding: 10,
            itemGap: 3,
	        data: names
	    },
	    calculable : true,
	    series : [
	        {
	            name:'Imaging Methods',
	            type:'pie',
	            radius : '55%',
	            center: ['50%', 225],
	            data: pieData
	        }
	    ]
	};
	
	//Bar chart (Sample type) option
	bar_options = {
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {
	            type: 'shadow'
	        }
	    },
	    legend: {
	        orient : 'horizontal',
	        x : 'center',
			y : 'bottom',
			padding: 5,
            itemGap: 3,
	        data: names
	    },
	    toolbox: {
	        show : false,
	        orient : 'vertical',
	        y : 'center',
	        feature : {
	            mark : {show: true},
	            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['Mutants','Wildtype']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            splitArea : {show : true}
	        }
	    ],
	    grid: {
	        x2:40
	    },
	    series : [
	        {
	            name:'X-ray illumination',
	            type:'bar',
	            stack: 'Total',
	            data: barData['X-ray illumination']
	        },
	        {
	            name:'mode of light microscopy',
	            type:'bar',
	            stack: 'Total',
	            data: barData['mode of light microscopy']
	        },
	        {
	            name:'macroscopy',
	            type:'bar',
	            stack: 'Total',
	            data: barData['macroscopy']
	        },
	        {
	            name:'bright-field microscopy',
	            type:'bar',
	            stack: 'Total',
	            data: barData['bright-field microscopy']
	        },
	        {
	            name:'confocal microscopy',
	            type:'bar',
	            stack: 'Total',
	            data: barData['confocal microscopy']
	        }
	    ]
	};
	
	
	//myChart2 = echarts.init(document.getElementById('main2'));
	//myChart2.setOption(option2);

	setTimeout(function (){
	    window.onresize = function () {
	        myChart.resize();
	        myChart2.resize();
	    }
	},200)
	
	imagingMethodSamplePlot = echarts.init(document.getElementById('imagingMethods-sample-chart'));
	imagingMethodSamplePlot.setOption(pie_options);
	
	imagingMethodSamplePlot2 = echarts.init(document.getElementById('imagingMethods-sample-chart2'));
	imagingMethodSamplePlot2.setOption(bar_options);

	imagingMethodSamplePlot.connect(imagingMethodSamplePlot2);
	imagingMethodSamplePlot2.connect(imagingMethodSamplePlot);
};


Stats.prototype.sampleTypePlot = function(){
	var sample_type_container = 'sample-type-chart';
	var plotData = [];
	
	//extract and prepare plot data
	for (key in this.stats.sampleTypeImageTypeData){
		if (key == "Wildtype" || key == "Mutants")
			plotData.push([key, this.stats.sampleTypeImageTypeData[key].percentage]);
	}
	
	//construct sample type chart
	var sampleShareChart = new Highcharts.Chart({
		credits:{
			enabled: false
		},
        chart: {
			renderTo: sample_type_container,
            plotBackgroundColor: null,
            plotBorderWidth: 0,//null,
            plotShadow: false,
			type: 'pie',
        },
        title: {
            text: 'By Sample types',
			verticalAlign: "bottom",
			y:-10
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
				depth: 35,
                dataLabels: {
                    enabled: false,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
				showInLegend: true
            }
        },
		legend:{
			y:-60
		},
        series: [{
            type: 'pie',
            name: 'Sample type share',
            data: plotData
        }]	
	});
};

Stats.prototype.imageTypePlot = function(){
	var image_type_container = 'image-type-chart';
	var plotData = [];
	
	//extract and prepare plot data
	for (key in this.stats.sampleTypeImageTypeData){
		if (key == "Expression" || key == "Phenotype")
			plotData.push([key, this.stats.sampleTypeImageTypeData[key].percentage]);
	}
	
	//construct sample type chart
	var imageShareChart = new Highcharts.Chart({
		credits:{
			enabled: false
		},
        chart: {
			renderTo: image_type_container,
            plotBackgroundColor: null,
            plotBorderWidth: 0,//null,
            plotShadow: false,
			type: 'pie',
        },
        title: {
            text: 'By Image type',
			verticalAlign: "bottom",
			y:-10
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
				depth: 35,
                dataLabels: {
                    enabled: false,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
				showInLegend: true
            }
        },
		legend:{
			y:-60
		},
        series: [{
            type: 'pie',
            name: 'Image type share',
            data: plotData
        }]	
	});
};

Stats.prototype.stagePlot = function(){
	var stage_container = 'stage-chart';
	var plotData = [];
	
	//extract and prepare plot data
	for (key in this.stats.stageStatsData){
		plotData.push([key, this.stats.stageStatsData[key].percentage]);
	}
	
	//construct sample type chart
	var stageShareChart = new Highcharts.Chart({
		credits:{
			enabled: false
		},
        chart: {
			renderTo: stage_container,
            plotBackgroundColor: null,
            plotBorderWidth: 0,//null,
            plotShadow: false,
			type: 'pie',
        },
        title: {
            text: 'By Development Stage',
			verticalAlign: "bottom",
			y:-10
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
				depth: 35,
                dataLabels: {
                    enabled: false,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
				showInLegend: true
            }
        },
		legend:{
			y:-60
		},
        series: [{
            type: 'pie',
            name: 'Stage share',
            data: plotData
        }]	
	});
};

Stats.prototype.imagingMethodPlot = function() {
	var imagingMethod_container = 'imagingmethods-chart';
	var plotData = [];
	
	//extract and prepare plot data
	for (key in this.stats.imagingMethodsData){
		plotData.push([key, this.stats.imagingMethodsData[key].percentage]);
	}
	
	//construct sample type chart
	var imagingSharechart = new Highcharts.Chart({
		credits:{
			enabled: false
		},
        chart: {
			renderTo: imagingMethod_container,
            plotBackgroundColor: null,
            plotBorderWidth: 0,//null,
            plotShadow: false,
			type: 'pie',
        },
        title: {
            text: 'By Imaging methods',
			verticalAlign: "bottom",
			y:-10
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
				depth: 35,
                dataLabels: {
                    enabled: false,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
				showInLegend: true
            }
        },
		legend:{
			y:-60
		},
        series: [{
            type: 'pie',
            name: 'Image method share',
            data: plotData
        }]	
	});
};

/**
 * Generate stage statistics data.
*/
Stats.prototype.computeStageStats = function(data) {
	if (!data.facet_counts.facet_fields || !data.facet_counts.facet_fields.stage)
		return;
	
	var stage_field = data.facet_counts.facet_fields.stage;
	
	var STAGE_VALUE_OFFSET = 1;
	var stages = {};
	var stageStatsData = {};
	var totalCount;
	
	var stageCount = stage_field.length, totalCount = 0 ;
	
	for (var i = 0 ; i < stageCount ; i++){
		
		if(typeof stage_field[i] == 'string'){
			stages[ stage_field[i] ] = stage_field[i + STAGE_VALUE_OFFSET] ;
		}else{
			totalCount = totalCount + stage_field[i];
		}
		
	}
	
	for (key in stages){
		var value = stages[ key ];
		var percentage = stages[ key ] / totalCount;
		var value_share = {};
		
		value_share.value = value;
		value_share.percentage = percentage;
		
		stageStatsData[key] = value_share;
		
	}
	
	return stageStatsData;
};

/**
 * Generate imaging methods statistics.
*/
Stats.prototype.computeImagingMethodStats = function(data) {
	if (!data.facet_counts.facet_fields || !data.facet_counts.facet_fields.imaging_method_label)
		return;
	
	var imagingMethod = data.facet_counts.facet_fields.imaging_method_label;
	
	var METHODS_VALUE_OFFSET = 1;
	var methods = {};
	var imagingMethodsData = {};
	
	var methodsCount = imagingMethod.length, totalCount = 0 ;
	
	for (var i = 0 ; i < methodsCount ; i++){
		
		if(typeof imagingMethod[i] == 'string'){
			methods[ imagingMethod[i] ] = imagingMethod[i + METHODS_VALUE_OFFSET] ;
		}else{
			totalCount = totalCount + imagingMethod[i];
		}
		
	}
	
	for (key in methods){
		var value = methods[ key ];
		var percentage = methods[ key ] / totalCount;
		var value_share = {};
		
		value_share.value = value;
		value_share.percentage = percentage;
		
		imagingMethodsData[key] = value_share;
		
	}
	
	return imagingMethodsData;
};

/**
 * Compute statistics for sample type, image type.
*/
Stats.prototype.computeSampleImageTypeStats = function(data) {
	var sample_type_image_type = data['facet_counts']['facet_pivot']['sample_type,image_type'];
	var sample_type_image_type_count = sample_type_image_type.length;
	
	var mutantPercentage = 0.0,
		mutantCount = 0;
		
	var wildtypePercentage = 0.0,
		wildtypeCount = 0;
	
	var phenotypePercentage = 0.0,
		phenotypeCount = 0;
		
	var expressionPercentage = 0.0,
		expressionCount = 0;
		
	var totalSampleType = 0;
	var totalImageType = 0;
	
	var sampleImagePlotData = {};
	var wildtype_dict = {};
	var mutant_dict = {};
	var expression_dict = {};
	var phenotype_dict = {};
	
	for (i = 0; i < sample_type_image_type_count ; i++){
		if (sample_type_image_type[i].field == "sample_type"){
				
			if(sample_type_image_type[i].value == "MUTANT"){
				var pivots = sample_type_image_type[i].pivot.length;
				mutantCount = mutantCount + sample_type_image_type[i].count ;
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "PHENOTYPE_ANATOMY"){
						phenotypeCount = phenotypeCount + sample_type_image_type[i].pivot[j].count;
					}else if (sample_type_image_type[i].pivot[j].value == "EXPRESSION"){
						expressionCount = expressionCount + sample_type_image_type[i].pivot[j].count;
					}
				}
				
				mutant_dict.value = mutantCount;
				
			}else if (sample_type_image_type[i].value == "WILD_TYPE"){
				var pivots = sample_type_image_type[i].pivot.length;
				wildtypeCount = wildtypeCount + sample_type_image_type[i].count;
				
				for (j = 0 ; j < pivots ; j++){
					if (sample_type_image_type[i].pivot[j].value == "PHENOTYPE_ANATOMY"){
						phenotypeCount = phenotypeCount + sample_type_image_type[i].pivot[j].count;
						phenotype_dict.value = phenotypeCount;
					}
					else if (sample_type_image_type[i].pivot[j].value == "EXPRESSION"){
						expressionCount = expressionCount + sample_type_image_type[i].pivot[j].count;
						expression_dict.value = expressionCount;
					}
				}
				
				wildtype_dict.value = wildtypeCount;
				 
			}
			
		}
	
	}
	
	
	//compute totals and percentages
	totalSampleType = mutantCount + wildtypeCount ;
	totalImageType = phenotypeCount + expressionCount ;
	mutantPercentage = (mutantCount / totalSampleType) * 100;
	wildtypePercentage = (wildtypeCount / totalSampleType) * 100;
	expressionPercentage = (expressionCount / totalImageType) * 100;
	phenotypePercentage = (phenotypeCount / totalSampleType) * 100;
	
	wildtype_dict.percentage = wildtypePercentage, 
		sampleImagePlotData["Wildtype"] = wildtype_dict;
	mutant_dict.percentage = mutantPercentage,
		sampleImagePlotData["Mutants"] = mutant_dict;
	expression_dict.percentage = expressionPercentage,
		sampleImagePlotData["Expression"] = expression_dict;
	phenotype_dict.percentage = phenotypePercentage,
		sampleImagePlotData["Phenotype"] = phenotype_dict;;
	
	
	
		return sampleImagePlotData;
};


//Obtain raw data from IQS/Solr (initial implementation obtains data from facets data)
Stats.prototype.generateStatsAndCharts = function() {
	var searchString = "";
	var queryParams = "";

	var query_base_url = this.query_base_url;
	var renderCharts = this.renderCharts;
	var computeSampleImageTypeStats = this.computeSampleImageTypeStats;
	var computeImagingMethodStats = this.computeImagingMethodStats;
	var computeStageStats = this.computeStageStats;
	
	var stats = this.stats;
	
	$.getJSON(query_base_url + "getImages?q=" + searchString,queryParams, $.proxy(this.generateDefaultChartsData, this));
	

};

Stats.prototype.generateDefaultChartsData = function(data, textStatus, jqXHR) {
	
	//compute statistics
	this.computeStats(data);
	
	//create charts
	this.renderCharts();

	$.getJSON(this.query_base_url + "getImages?q=&sampleType=WILD_TYPE" + this.searchString,this.queryParams, $.proxy(this.generateWTIMChartsData, this));
};

Stats.prototype.generateWTIMChartsData = function(data, textStatus, jqXHR) {
	//compute statistics
	this.computeWTIMStats(data);
	
	//create charts
	//this.renderSTIMCharts();
	$.getJSON(this.query_base_url + "getImages?q=&sampleType=MUTANT" + this.searchString,this.queryParams, $.proxy(this.generateMTIMChartsData, this));
};

Stats.prototype.generateMTIMChartsData = function(data, textStatus, jqXHR) {
	//compute statistics
	this.computeMTIMStats(data);
	
	//create charts
	this.renderSTIMCharts();
};

Stats.prototype.morePlots = function() {
	//compute statistics
	this.renderSTIMCharts();

};

Stats.prototype.computeWTIMStats = function(data) {
	this.stats.imagingMethodWiltypeData = this.computeImagingMethodStats(data);
};

Stats.prototype.computeMTIMStats = function(data) {
	this.stats.imagingMethodMutantData = this.computeImagingMethodStats(data);
};

Stats.prototype.computeStats = function(data) {
   //compute sample types and image types
   this.stats.sampleTypeImageTypeData = this.computeSampleImageTypeStats(data);
   		   
   //compute imaging methods stats
   this.stats.imagingMethodsData = this.computeImagingMethodStats(data);

   //compute stage stats
   this.stats.stageStatsData = this.computeStageStats(data);
};
