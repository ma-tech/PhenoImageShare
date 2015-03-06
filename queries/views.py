from django.shortcuts import render
from django.http import HttpResponse
import simplejson
import urllib2
import urllib
from pis.settings import IQS as iqs
#import deepzoom
import re
import os

try: from pis.settings import BASE_URL
except ImportError: BASE_URL="http://dev.phenoimageshare.org"

try: from pis.settings import BASE_PORT
except ImportError: BASE_PORT=80

dev_api = iqs['URL']['HWU']
beta_api = iqs['URL']['EBI']

api_url = dev_api

access_points = iqs['ACP']
image_acp = access_points['getimages']['name']
image_endpoints = access_points['getimages']['options']

autosuggest_acp = access_points['getautosuggest']['name']
autosuggest_endpoints = access_points['getautosuggest']['options']

def index(request):
    return render(request, 'queries/html/phis_index.html', '')

def query_view(request):
    queryString = ""
    response = {}
    source_url = ""
    DEFAULT_PORT = 80
    
    if 'term' in request.GET:
        response = simplejson.dumps(dict(request.GET.iterlists()))
    elif 'q' in request.GET:
        response = simplejson.dumps({"term":[request.GET['q']]})

    if BASE_PORT is not DEFAULT_PORT:
        source_url = BASE_URL + ":" + str(BASE_PORT)
    else:
        source_url = BASE_URL
        
    context = {"query": response, "source_url": source_url} 
    return render(request, 'queries/html/query_view.html', context)

def detail_view(request):
    context = get_image_data(request)
    
    return render(request, 'queries/html/detailed_view.html', context)
    
def get_image_data(request):
    queryString = ""
    image_data = []
    docs = {}
    imageString = ""
    base_url = ""
    query = {}
    
    if 'q' in request.GET:
        queryString = request.GET['q']
    else:
        queryString = "MP:0010254"
        
    if 'img' in request.GET:
        imageString = request.GET['img']
    else:
        imageString = "http://www.mousephenotype.org/data/media/images/0/M00144272_00010241_download_full.jpg"
    
    if "MP" in queryString:
        query[image_endpoints['phenotype']] = queryString   
    elif "MA" in queryString:
        query[image_endpoints['anatomy']] = queryString 
    elif "MGI" in queryString:
        query[image_endpoints['gene']] = queryString 
    elif queryString == "":
        query = {}
    else:
        query[image_endpoints['term']] = queryString 
      
    url = api_url + image_acp
    url_data=urllib.urlencode(query)
    req = urllib2.Request(url, url_data)
    
    try:
        response = urllib2.urlopen(req)
    
        json_data = simplejson.load(response)
        docs = json_data['response']['docs']
        
    except (urllib2.HTTPError, urllib2.URLError, simplejson.JSONDecodeError):
        json_data = get_local_data()
        docs = json_data['response']['docs']
    
    image_data = process_docs(docs, imageString, queryString)
    source_location, image_name = downloadImage(imageString)
    #dzi_location = generateImageTiles(source_location, image_name)
    
    context = {"image_data": image_data, "dzi_name": image_name}
    
    return context

def generateImageTiles(source_location, image_name):
   
    # Creating Deep Zoom Image creator with default parameters
    #creator = deepzoom.ImageCreator(tile_size=128, tile_overlap=2, tile_format="png",
    #                               image_quality=0.8, resize_filter="bicubic")
    
    dzi_base = '/opt/pheno/python/PhenoImageShare/static/utils/images/dzifiles/'
    dzi_location = dzi_base + image_name + '.dzi'
    
    # Create Deep Zoom image pyramid from source
    creator.create(source_location, dzi_location)
    
    return dzi_location

def downloadImage(url):
    
    image_name = re.search("(?P<url>[^\s]+)/(?P<name>[^\s]+)", url).group("name")
    source_base = '/opt/pheno/python/PhenoImageShare/static/utils/images/sources/'
    source_location = source_base + image_name
    
    if os.path.isfile(source_location) == False:
        image_file = open(source_location, 'wb')
        image_file.write(urllib.urlopen(url).read())
        image_file.close()
    
    return (source_location, image_name)
    
def process_docs(docs, imageString, queryString):
    image_data_dict = {}
    image_data = []
    
    for doc in docs:
        if doc['image_url'] == imageString:
            
            if "sex" in doc:
                image_data_dict['sex'] = doc['sex']
            
            if "age" in doc:
                image_data_dict['age'] = doc['age']
        
            if "age_since_birth" in doc:
                image_data_dict['age'] = doc['age_since_birth']
                
            if "embrionic_age" in doc:
                image_data_dict['embrionic_age'] = doc['embrionic_age']  
                  
            if "host_name" in doc:
                image_data_dict['host_name'] = doc['host_name']
                image_data_dict['source'] = doc['host_name']
                
            if "anatomy_term" in doc:
                image_data_dict['anatomy_term'] = doc['anatomy_term']
            
            if "sample_generated_by" in doc:
                image_data_dict['sample_generated_by'] = doc['sample_generated_by']
            
            if "image_generated_by" in doc:
                image_data_dict['image_generated_by'] = doc['image_generated_by']
            
            if "sample_preparation_label" in doc:
                image_data_dict['sample_preparation'] = doc['sample_preparation_label']
                
            if "image_url" in doc:
                image_data_dict['url'] = doc['image_url']
            
            if "sample_type" in doc:
                image_data_dict['sample_type'] = doc['sample_type']
            
            if "image_type" in doc:
                image_data_dict['image_type'] = doc['image_type']
            
            if "zygosity" in doc:
                image_data_dict['zygosity'] = doc['zygosity']
            
            if "height" in doc:
                image_data_dict['height'] = doc['height']
                
            if "width" in doc:
                image_data_dict['width'] = doc['width']
                  
            if "associated_roi" in doc:
                rois = []
                
                for roi in doc['associated_roi']:
                    rois.append(str(roi))
                
                image_data_dict['associatedROI'] = rois
                
            if "observations" in doc:
                observations = []
                for observation in doc['observations']:
                    observations.append(observation.split(':',1))
                
                image_data_dict['observations'] = observations
            
            if "taxon" in doc:
                image_data_dict['organism'] = doc['taxon']
            
            if "imaging_method_label" in doc:
                image_data_dict['imaging_method_label'] = doc['imaging_method_label']
                
            if "stage" in doc:
                image_data_dict['stage'] = doc['stage']
                     
            if "gene_symbol" in doc:
                gene_symbols = []
                for gene_symbol in doc['gene_symbol']:
                    gene_symbols.append(gene_symbol)
                image_data_dict['gene'] = gene_symbols       
                        
            if "phenotype_label_bag" in doc:
                phenotype_list = []
            
                for phenotype in doc['phenotype_label_bag']:
                    phenotype_list.append(phenotype)
                image_data_dict['phenotype_ann_bag'] = phenotype_list
                
            image_data_dict['id'] = doc['id']
            
            image_data_dict['queryString'] = queryString
            image_data_dict['imageURL'] = imageString
            
            image_data.append(image_data_dict)
            
    return image_data        
            
def get_local_data():
    json_data_file = open('/opt/pheno/python/pis/static/queries/txt/search_response_hwu_ann.json')
    json_data = simplejson.load(json_data_file)
      
    return json_data
    
def processQuery(request):
    query = {}
    
    #Initialisation of query parameters, not required. TODO: device alternative declaration
    queryString = ""
    
    if 'q' in request.GET:
        queryString = request.GET['q']
    elif 'term' in request.GET:
        queryString = request.GET['term']
    
    if "MP" in queryString:
        query[image_endpoints['phenotype']] = queryString  
    elif "MA" in queryString:
        query[image_endpoints['anatomy']] = request.GET['anatomy']
    elif "MGI" in queryString:
        query[image_endpoints['gene']] = queryString
    elif queryString == "":
        query = {}
    else:
        query[image_endpoints['term']] = queryString 
    
    #assignment of query parameters from Ajax call from facets.
    if 'sampleType' in request.GET:
        query[image_endpoints['sampleType']] = request.GET['sampleType'] 
    if 'imageType' in request.GET:
        query[image_endpoints['imageType']] = request.GET['imageType']
    if 'sex' in request.GET:
        query[image_endpoints['sex']] = request.GET['sex'] 
    if 'taxon' in request.GET:
        query[image_endpoints['taxon']] = request.GET['taxon'] 
    if 'stage' in request.GET:
        query[image_endpoints['stage']] = request.GET['stage'] 
    if 'samplePreparation' in request.GET:
        query[image_endpoints['samplePreparation']] = request.GET['samplePreparation'] 
    if 'imagingMethod' in request.GET:
        query[image_endpoints['imagingMethod']] = request.GET['imagingMethod'] 
    if 'num' in request.GET:
        query[image_endpoints['num']] = request.GET['num'] 
    if 'start' in request.GET:
        query[image_endpoints['start']] = request.GET['start']  
    if 'phenotype' in request.GET:
        query[image_endpoints['phenotype']] = request.GET['phenotype'] 
    if 'anatomy' in request.GET:
        query[image_endpoints['anatomy']] = request.GET['anatomy'] 
    if 'gene' in request.GET:
        query[image_endpoints['mutantGene']] = request.GET['gene']
        
    url = api_url + image_acp
    url_data=urllib.urlencode(query)
    req = urllib2.Request(url, url_data)
    
    response = urllib2.urlopen(req)
    
    return response
    
def getImages(request):
    
    json_response = processQuery(request)
    return HttpResponse(json_response, mimetype='application/json')
    
def getAutosuggest(request):
    query = {}
    
    if 'term' in request.GET:
        queryString = request.GET['term']
    else:
        queryString = "unset"

    query[autosuggest_endpoints['term']] = queryString 
     
    url = api_url + autosuggest_acp
    url_data=urllib.urlencode(query)
    req = urllib2.Request(url, url_data)
    
    response = urllib2.urlopen(req)
    responsedata = simplejson.load(response)
    
    autosuggestdata = simplejson.dumps(responsedata['response']['suggestions'])
    
    return HttpResponse(autosuggestdata, mimetype='application/json')
    