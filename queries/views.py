from django.shortcuts import render
from django.http import HttpResponse
import simplejson
import urllib2
import urllib
from pis.settings import IQS as iqs

dev_api = iqs['URL']['HWU']
beta_api = iqs['URL']['EBI']

api_url = dev_api

access_points = iqs['ACP']
image_acp = access_points['getimages']['name']
image_endpoints = access_points['getimages']['options']

def index(request):
    return render(request, 'queries/html/index.html', '')

def query_view(request):
    return render(request, 'queries/html/query_view.html', '')

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
    context = {"image_data": image_data}
    
    return context

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
                image_data_dict['age'] = doc['embrionic_age']  
                  
            if "host_name" in doc:
                image_data_dict['host_name'] = doc['host_name']
                image_data_dict['source'] = doc['host_name']
                
            if "anatomy_term" in doc:
                image_data_dict['anatomy_term'] = doc['anatomy_term']
            
            if "sample_generated_by" in doc:
                image_data_dict['sample_generated_by'] = doc['sample_generated_by']
            
            if "sample_preparation_label" in doc:
                image_data_dict['sample_preparation'] = doc['sample_preparation_label']
                
            if "image_url" in doc:
                image_data_dict['url'] = doc['image_url']
            
            if "associated_roi" in doc:
                rois = []
                
                for roi in doc['associated_roi']:
                    rois.append(str(roi))
                
                image_data_dict['associatedROI'] = rois
                
            if "observations" in doc:
                observations = []
                for observation in doc['observations']:
                    observations.append(observation)
                
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
     
def getImages(request):
    query = {}
    queryString = ""
    
    if 'q' in request.GET:
        queryString = request.GET['q']
    else:
        queryString = "unset"
    
    if "MP" in queryString:
        query[image_endpoints['phenotype']] = queryString   
    elif "MA" in queryString:
        query[image_endpoints['anatomy']] = queryString 
    elif "MGI" in queryString:
        query[image_endpoints['gene']] = queryString 
    else:
        query[image_endpoints['term']] = queryString 
    
    url = api_url + image_acp
    url_data=urllib.urlencode(query)
    req = urllib2.Request(url, url_data)
    
    response = urllib2.urlopen(req)
    
    return HttpResponse(response, mimetype='application/json')