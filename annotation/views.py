from django.shortcuts import render
import logging
from django.http import HttpResponse, Http404
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

logger = logging.getLogger(__name__)

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
    context = {}
    
    if 'imageId' in request.GET:
        imageId = request.GET['imageId']
        dziName =  imageId + '.dzi'
        
        roiData = getRoiData(imageId)
        url = getImageURL(imageId)
        dimension = getImageDimension(imageId)
        
        imageData = {"Id":imageId,"dziName": dziName, "url": url, "dimension": dimension}
        context = {"roiData":roiData, "image":imageData}
        
    return render(request, 'annotation/html/annotation_view.html', context)

def getRoiData(imageId):
    return qviews.getROIs(imageId)

def getImageDimension(imageId):
    return qviews.getImageDimension(imageId)

def getImageURL(imageId):
    return qviews.getImageURL(imageId)

def getTree(request):
    myTree = {'children': [], 'title':'Mouse', 'hideCheckbox': 'false', "isLazy": 'true'}
    myTree['children'].append( {'title':'body fluid or substance', 'children':[],'hideCheckbox': 'false', "key":"Child 1", "isLazy": 'true'} )
    myTree['children'].append( {'title':'body region', 'children':[], 'hideCheckbox': 'false', "key":"Child 2",  "isLazy": 'true'} )
    myTree['children'].append( {'title':'germ layer', 'children':[], 'hideCheckbox': 'false', "key":"Child 3", "isLazy": 'true'} )

    # Convert result list to a JSON string
    res = simplejson.dumps(myTree, encoding="Latin-1")

    # Support for the JSONP protocol.
    response_dict = {}
    if request.GET.has_key('callback'):
        response_dict = request.GET['callback'] + "(" + res + ")"
    else:
        response_dict = res

    return HttpResponse(response_dict, mimetype='application/json')
    
    response_dict = {}
    response_dict.update({'children': tree })
    return HttpResponse(response_dict, mimetype='application/javascript')

def getDZI(request):
    pass