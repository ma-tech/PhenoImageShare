from django.shortcuts import render

try:
    from pymongo import MongoClient 
except: 
    pass
    
import simplejson
from queries import views as qviews
import urllib2
import urllib
from pis.settings import IQS as iqs

dev_api = iqs['URL']['HWU']
beta_api = iqs['URL']['EBI']

api_url = dev_api

access_points = iqs['ACP']
image_acp = access_points['getimages']['name']
image_endpoints = access_points['getimages']['options']

def save_annotations(request):
    if request.is_ajax():
        
        try:
            annotation_data = simplejson.loads(request.body)
            mongoClient = MongoClient()
        
            phis_db = mongoClient.phis
            phis_collection = phis_db.annotations
            doc_id = phis_collection.insert(annotation_data)
        
            message = "Inserted document with ID: "+ str(doc_id)
        except:
            pass
    else:
        message = "Not Ajax call"
    
    return HttpResponse(simplejson.dumps({'message' : message},ensure_ascii=False), mimetype='application/javascript')

def drawing_view(request):
 
    if 'local' in request.GET:
        json_data = qviews.get_local_data()
        docs = json_data['response']['docs']
                
        roi_data = getROI(docs, imageString, queryString)
        context = {"image_data": roi_data}
    else:  
        context = get_roi_data(request)
        
    return render(request, 'annotation/html/drawing_view.html', context)
    
def get_roi_data(request):
    roi_data_dict = {}
    roi_docs = []
    roi_data = []
    roi_ids = []
    docs = {}
    imageString = ""
    queryString = ""
    image_base_url = ""
    query = {}
    
        
    if 'q' in request.GET:
        queryString = request.GET['q']
    else:
        queryString = "MP:0010254"
        
    if 'img' in request.GET:
        imageString = request.GET['img']
        roi_data_dict['image_url'] = imageString
    
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
        
    for doc in docs:
        if doc['image_url'] == imageString:
            if "associated_roi" in doc:
                roi_ids = doc['associated_roi']
            
                for roi_id in roi_ids:
                    base_url = "http://lxbisel.macs.hw.ac.uk:8080/IQS/getroi?id="
                    url = base_url + roi_id
                    req = urllib2.Request(url)
                    response = urllib2.urlopen(req)
                    json_data = simplejson.load(response)
        
                    roi_docs.append(json_data['response']['docs'])

    roi_data_dict['roi_docs'] = roi_docs
    roi_data.append(roi_data_dict)
    
    context = {"roi_data": roi_data}
    
    return context
    

def process_roi_docs(roi_docs):
    image_data_dict = {}
    roi_data = []
    
    for roi in roi_docs:
        roi_data.append(roi)
   
    return roi_data 
    

def get_fdp_data(request):
    return process_fdp_docs()

def process_fdp_docs():
    fdp_data_dict = {}
    fdp_data = []    
    
    return fdp_data
    
def getChannel(request):
    pass