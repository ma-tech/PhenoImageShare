from django.shortcuts import render
from django.http import QueryDict
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
from pis.settings import ISS as iss

dev_api = iqs['URL']['HWU']
beta_api = iqs['URL']['EBI']

dev_api_iss = iss['URL']['HWU']
beta_api_iss = iss['URL']['EBI']

api_url = dev_api
api_url_iss = dev_api_iss

access_points = iqs['ACP']
image_acp = access_points['getimages']['name']
image_endpoints = access_points['getimages']['options']

access_points_iss = iss['ACP']
annotation_acp = access_points_iss['annotation']['name']
annotation_endpoints = access_points_iss['annotation']['options']

import re
import os
import logging

logger = logging.getLogger(__name__)

iss_version = '101'

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


def drawing_zoomable(request):
    context = {}
    
    if 'imageId' in request.GET:
        imageId = request.GET['imageId']
        dziName =  imageId + '.dzi'
        
        roiData = getRoiData(imageId)
        url = getImageURL(imageId)
        dimension = getImageDimension(imageId)
        
        imageData = {"Id":imageId,"dziName": dziName, "url": url, "dimension": dimension}
        context = {"roiData":roiData, "image":imageData}
        
    return render(request, 'annotation/html/drawing_zoomable.html', context)


def drawing_view_old(request):
    context = {}
    
    if 'imageId' in request.GET:
        imageId = request.GET['imageId']
        dziName =  imageId + '.dzi'
        
        roiData = getRoiData(imageId)
        url = getImageURL(imageId)
        dimension = getImageDimension(imageId)
        
        imageData = {"Id":imageId,"dziName": dziName, "url": url, "dimension": dimension}
        context = {"roiData":roiData, "image":imageData}
        
        logger.debug(str(context))
    return render(request, 'annotation/html/drawing_view_copy.html', context)
    
def getRoiData(imageId):
    return simplejson.dumps(qviews.getROIs(imageId)['response']['docs'])

def getImageDimension(imageId):
    return qviews.getImageDimension(imageId)

def getImageURL(imageId):
    return qviews.getImageURL(imageId)

def getTree(request):
    myTree = {'children': [], 'title':'Mouse', 'hideCheckbox': 'false', "isLazy": 'true'}
    myTree['children'].append( {'title':'body fluid or substance', 'children':[],'hideCheckbox': 'false', "key":"Child 1", "isLazy": 'true'} )
    myTree['children'].append( {'title':'body region', 'children':[], 'hideCheckbox': 'false', "key":"Child 2",  "isLazy": 'true'} )
    myTree['children'].append( {'title':'germ layer', 'children':[], 'hideCheckbox': 'false', "key":"Child 3", "isLazy": 'true'} )

    jsTree = [
           { "id" : "ajson1", "parent" : "#", "text" : "Simple root node" },
           { "id" : "ajson2", "parent" : "#", "text" : "Root node 2", "children":True },
    ]

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
    
def addAnnotation(request):
    query = {}
    query['version'] = iss_version
        
    if request.is_ajax():
        try:
            """"
            annotation_data = simplejson.loads(request.body)
            mongoClient = MongoClient()
        
            phis_db = mongoClient.phis
            phis_collection = phis_db.annotations
            doc_id = phis_collection.insert(annotation_data)
        
            message = "Inserted document with ID: "+ str(doc_id)
            """
            
            logger.debug("POST data")
            logger.debug(request.body)
            
            logger.debug("GET data")
            logger.debug(request.GET)
            
            annotation_data = request.GET.copy()
            annotation_data.update(simplejson.loads(request.body))
            annotation_data.update(query)
            
            logger.debug("Annotation data from GUI:")
            logger.debug(annotation_data)
            
            url = api_url_iss + annotation_acp
            url_data=urllib.urlencode(annotation_data)
            
            logger.debug("Annotation data (urlencoded)")
            logger.debug(annotation_data.urlencode())
            
            logger.debug("url data")
            logger.debug(url_data)
            
            req = urllib2.Request(url, annotation_data.urlencode())
            
            response = urllib2.urlopen(req)
            annotation_response = simplejson.load(response)
            
            message = annotation_response
            logger.debug(message)
                                                                                                                                                                                                           
        except (urllib2.HTTPError, urllib2.URLError, simplejson.JSONDecodeError):
            logger.debug("Error preparing and processing annotation query")
            message = "Error preparing and processing annotation query"
            
    else:
        message = "Not Ajax call"
    
    return HttpResponse(simplejson.dumps({'message' : message},ensure_ascii=False), mimetype='application/javascript')
    
def updateAnnotation(request):
    pass

def deleteAnnotation(request):
    pass
    
def getOntologies(request):
    context = {}
    return render(request, 'annotation/html/ontologies_view.html', context)
    
def site_config(request):
    bp = {"org":"NCBO","org_url":"http://www.bioontology.org","site":"BioPortal","org_site":"NCBO BioPortal",
    "ui_url":"http://bioportal.bioontology.org","apikey":"8b5b7825-538d-40e0-9e9e-5ab9274a9aeb",
    "userapikey":"8b5b7825-538d-40e0-9e9e-5ab9274a9aeb","rest_url":"http://data.bioontology.org",
    "biomixer_url":"http://bioportal-integration.bio-mixer.appspot.com"}
    
    # Convert result list to a JSON string
    res = simplejson.dumps(bp, encoding="Latin-1")

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

def mvc(request):
    return render(request, 'annotation/html/mvc.html', {})

def annotation_tool(request):
    context = {}
    
    if 'imageId' in request.GET:
        imageId = request.GET['imageId']
        dziName =  imageId + '.dzi'
        
        roiData = getRoiData(imageId)
        url = getImageURL(imageId)
        dimension = getImageDimension(imageId)
        
        imageData = {"Id":imageId,"dziName": dziName, "url": url, "dimension": dimension}
        context = {"roiData":roiData, "image":imageData}
        
        logger.debug(str(context))
    
    return render(request, 'annotation/html/annotation_tool.html', context)
    