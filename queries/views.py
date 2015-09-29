from django.shortcuts import render
from django.http import HttpResponse, Http404
import simplejson
import urllib2
import urllib
from pis.settings import IQS as iqs
from pis.settings import DZI_DIR
from pis.settings import IMAGE_RESOURCE_BASE
import smtplib
from email.mime.text import MIMEText

import re
import os
import logging

logger = logging.getLogger(__name__)

try: import deepzoom
except ImportError: logger.debug("Unable to load Deepzoom library")

try: from pis.settings import BASE_URL
except ImportError: BASE_URL="http://dev.phenoimageshare.org"

try: from pis.settings import BASE_PORT
except ImportError: BASE_PORT=80

try: from pis.settings import EMAIL_DEST
except ImportError: EMAIL_DEST = 'webmaster@phenoimageshare.org'

try: from pis.settings import EMAIL_SOURCE
except ImportError: EMAIL_SOURCE = 'gui@phenoimageshare.org'

try: from pis.settings import MIDDLEWARE_CONNECTIVITY_ALERT
except ImportError: MIDDLEWARE_CONNECTIVITY_ALERT = 'Error connecting to middleware service (IQS, ISS)'

api_url = iqs['URL']['LOCAL']

access_points = iqs['ACP']
image_acp = access_points['getimages']['name']
image_endpoints = access_points['getimages']['options']

image_details_acp = access_points['getimage']['name']
image_details_endpoints = access_points['getimage']['options']

rois_acp = access_points['getrois']['name']
rois_endpoints = access_points['getrois']['options']

roi_acp = access_points['getroi']['name']
roi_endpoints = access_points['getroi']['options']

channel_acp = access_points['getchannel']['name']
channel_endpoints = access_points['getchannel']['options']

autosuggest_acp = access_points['getautosuggest']['name']
autosuggest_endpoints = access_points['getautosuggest']['options']

getDataRelease_acp = access_points['getDataReleases']['name']
getDataRelease_endpoints = access_points['getDataReleases']['options']


#iqs_version = '007'
iqs_version = '100'

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
    imageId = ""
    base_url = ""
    query = {}
    query['version'] = iqs_version
    
    if 'q' in request.GET:
        queryString = request.GET['q']
    else:
        queryString = "MP:0010254"

    if 'imageId' in request.GET:
        query[image_details_endpoints['imageId']] = request.GET['imageId']
    else:
        logger.debug("No imageId provided")
        imageId = "komp2_112968"

    url = api_url + image_details_acp
    url_data=urllib.urlencode(query)
    req = urllib2.Request(url, url_data)
    
    try:
        response = urllib2.urlopen(req)
        json_data = simplejson.load(response)
        image_json = json_data['response']['docs'][0]
        (image_data, roi_data) = extract_image_data(image_json)
        
        logger.debug(image_data)
        logger.debug(roi_data)
        
    except (urllib2.HTTPError, urllib2.URLError, simplejson.JSONDecodeError):
        #(image_data, roi_data) = ('{"server_error": "Server Unreachable"}', '{"server_error": "Server Unreachable"}')
        logger.debug("Error extracting either ROI or Image data, email sent to administrator")
        
        raise Http404
    
    # Call functions to download image and generate dzi files from image
    image_name = downloadImage(image_data['url'], request.GET['imageId'])
    image_data['status'] = generateImageTiles(image_name, request.GET['imageId'])
       
    image_data['imageId'] = request.GET['imageId']
    image_data['queryString'] = queryString
    
    context = {"image": image_data, "roi_data":roi_data}
    
    return context

def generateImageTiles(imageName, imageId):
   
    # Creating Deep Zoom Image creator with default parameters
    creator = deepzoom.ImageCreator(tile_size=128, tile_overlap=2, tile_format="png",
                                  image_quality=0.8, resize_filter="bicubic")
    status = {};
    
    dzi_base = IMAGE_RESOURCE_BASE + '/dzifiles/'
    img_base = IMAGE_RESOURCE_BASE + '/sources/'
    img_location = img_base + imageName
    
    dzi_location = dzi_base + imageId + '.dzi'
    
    logger.debug("Creating deepzoom files for "+ imageId + " (located at " + img_location + ") in "+dzi_location)
    # Create Deep Zoom image pyramid from source
    if os.path.isfile(dzi_location) == False:
        try:
            creator.create(img_location, dzi_location)
            logger.debug("Successfully created deepzoom files for "+ imageId + "(located at " + img_location + ") in " + dzi_location)
            status['message'] = 'OK'
        except IOError:
            logger.debug("Error creating DZI file - I/O Error")
            status['NOK'] = 'Error reaching image resource server'
    else:
        logger.debug("Deepzoom file already exists on Image Server")
    
    return simplejson.dumps(status)

def downloadImage(url, imageId):
    
    image_name = re.search("(?P<url>[^\s]+)/(?P<name>[^\s]+)", url).group("name")
    source_base = IMAGE_RESOURCE_BASE + 'sources/'
    source_location = source_base + image_name
    
    if os.path.isfile(source_location) == False:
        try:
            image_file = open(source_location, 'wb')
            image_file.write(urllib.urlopen(url).read())
            image_file.close()
            logger.debug("Image downloaded from: " + url + " into: " + str(source_location))
        except IOError:
            logger.debug("Error downloading file from "+ url)
    else:
        logger.debug("Image file already exists on Image Server")
   
    return image_name
    
def extract_image_data(doc):
    image_data_dict = {}
    roi_data = []
            
    if "sex" in doc:
        image_data_dict['sex'] = doc['sex']
     
    if "age" in doc:
        image_data_dict['age'] = doc['age']

    if "age_since_birth" in doc:
        image_data_dict['age'] = doc['age_since_birth']
        
    if "embrionic_age" in doc:
        image_data_dict['embrionic_age'] = doc['embrionic_age']  
        
    if "id" in doc:
        image_data_dict['id'] = doc['id']  
          
    if "host_name" in doc:
        image_data_dict['host_name'] = doc['host_name']
        image_data_dict['source'] = doc['host_name']
        
    if "anatomy_term" in doc:
        image_data_dict['anatomy_term'] = doc['anatomy_term']
    
    if "host_url" in doc:
        image_data_dict['host_url'] = doc['host_url']
    
    if "sample_generated_by" in doc:
        image_data_dict['sample_generated_by'] = doc['sample_generated_by']
    
    if "image_generated_by" in doc:
        image_data_dict['image_generated_by'] = doc['image_generated_by']
    
    if "visualisation_method_label" in doc:
        image_data_dict['visualisation'] = doc['visualisation_method_label']
    elif "visualisation_method_freetext" in doc:
        image_data_dict['visualisation'] = doc['visualisation_method_freetext']
    elif "visualisation_method_id" in doc:
        image_data_dict['visualisation'] = doc['visualisation_method_id']
    
    if "sample_preparation_label" in doc:
        image_data_dict['sample_preparation'] = doc['sample_preparation_label']
        
    if "image_url" in doc:
        image_data_dict['url'] = doc['image_url']
    
    if "sample_type" in doc:
        image_data_dict['sample_type'] = doc['sample_type']
    
    if "expression_in_label_bag" in doc:
        image_data_dict['expression_in_label_bag'] = doc['expression_in_label_bag']
    
    if "depicted_anatomy_term_bag" in doc:
        image_data_dict['depicted_anatomy_term_bag'] = doc['depicted_anatomy_term_bag']
    
    if "image_type" in doc:
        image_data_dict['image_type'] = doc['image_type']
    
    if "zygosity" in doc:
        image_data_dict['zygosity'] = doc['zygosity']
    
    if "expressed_gf_symbol_bag" in doc:
        image_data_dict['expressed_gf_symbol'] = doc['expressed_gf_symbol_bag']
 
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

    if "chromosome" in doc:
        image_data_dict['chromosome'] = doc['chromosome']
   
    if "start_pos" in doc:
        image_data_dict['start_pos'] = doc['start_pos']       
    
    if "end_pos" in doc:
        image_data_dict['end_pos'] = doc['end_pos']

    if "strand" in doc:
        image_data_dict['strand'] = doc['strand']
   
    if "gene_symbol" in doc:
        gene_symbols = []
        for gene_symbol in doc['gene_symbol']:
            gene_symbols.append(gene_symbol)
        image_data_dict['gene'] = gene_symbols       
    
    if "mutation_type" in doc:
        mutation_types = []
        for mutation_type in doc['mutation_type']:
            mutation_types.append(mutation_type)
        image_data_dict['mutation_types'] = mutation_types
        
    if "phenotype_label_bag" in doc:
        phenotype_list = []
    
        for phenotype in doc['phenotype_label_bag']:
            phenotype_list.append(phenotype)
            image_data_dict['phenotype_ann_bag'] = phenotype_list
            image_data_dict['id'] = doc['id']
            image_data_dict['imageURL'] = doc['image_url']
            
            roi_data = getROIs(doc['id'])['response']['docs']
            
    logger.debug("extract_image_data: "+ str(roi_data))
            
    return (image_data_dict, simplejson.dumps(roi_data))        
    
def processQuery(request):
    query = {}
    query['version'] = iqs_version
    
    #Initialisation of query parameters, not required. TODO: device alternative declaration
    queryString = ""
    
    if 'q' in request.GET:
        queryString = request.GET['q']
    elif 'term' in request.GET:
        queryString = request.GET['term']
    """" 
    if 'emage_' in queryString:
       
        Routine for imageId
        response = getImageData(queryString)
        logger.debug("Query string = " + queryString)
        logger.debug(response)
        
        response = '{"server_error": "Search by image Id not yet supported"}'
    else:
     """
     
    if "MP:" in queryString:
        query[image_endpoints['phenotype']] = queryString  
    elif "MA:" in queryString:
        query[image_endpoints['anatomy']] = request.GET['anatomy']
    elif "MGI:" in queryString:
        query[image_endpoints['gene']] = queryString
    elif queryString == "":
        query['version'] = iqs_version
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
    if 'search[value]' in request.GET and request.GET['search[value]'] != "":
        logger.debug("Filter search value = " + request.GET['search[value]'])
        queryString = request.GET['search[value]']
        query[image_endpoints['term']] = queryString

    logger.debug("Query = " + simplejson.dumps(query))

    url = api_url + image_acp
    url_data=urllib.urlencode(query)
    req = urllib2.Request(url, url_data)

    try:
        response = urllib2.urlopen(req)
    
    except urllib2.URLError:
        message = {}
        message['body'] = MIDDLEWARE_CONNECTIVITY_ALERT
        message['subject'] = "API Connectivity Error"
        logger.debug(message)
        sendMail(message)
        response = '{"server_error": "Server Unreachable"}'
        
    return response
    
def getImages(request):
    json_response = processQuery(request)
    
    logger.debug(json_response)
    
    return HttpResponse(json_response, mimetype='application/json')
    
def getAutosuggest(request):
    query = {}
    query['version'] = iqs_version
    
    if 'term' in request.GET:
        queryString = request.GET['term']
        query[autosuggest_endpoints['term']] = queryString 
    
    if 'type' in request.GET:
        autosuggestype = request.GET['type']
        query[autosuggest_endpoints['asType']] = autosuggestype 
     
    url = api_url + autosuggest_acp
    url_data=urllib.urlencode(query)
    req = urllib2.Request(url, url_data)
    
    response = urllib2.urlopen(req)
    responsedata = simplejson.load(response)
    
    autosuggestdata = simplejson.dumps(responsedata['response']['suggestions'])
    
    return HttpResponse(autosuggestdata, mimetype='application/json')

def getROIs(imageId):
    query={}
    query['version'] = iqs_version
    
    try:
        query[rois_endpoints['imageId']] = imageId
        url = api_url + rois_acp
        url_data=urllib.urlencode(query)
        req = urllib2.Request(url, url_data)
    
        response = urllib2.urlopen(req)
        responsedata = simplejson.load(response)
        
        if responsedata is not None:
            for roi in responsedata:
                try: 
                    channels_data = []
                    
                    for channelId in roi['associated_channel']:
                        channels_data.append(getChannel(channelId)['response']['docs'][0])
                        
                    roi['channels'] = channels_data
                    #print roi.channel
                except:
                    logger.debug("No attribute exists")
                    
    except urllib2.HTTPError:
        message = {}
        message['body'] = MIDDLEWARE_CONNECTIVITY_ALERT
        message['subject'] = "API Connectivity Error"
        logger.debug(message)
        sendMail(message)
        responsedata = '{"server_error": "Server Unreachable"}'
        
    logger.debug("Response data for ROI: "+ str(responsedata))
     
    return responsedata

def get_roi_data(request):
    roiId = ""
    
    if 'id' in request.GET:
        roiId = request.GET['id']
            
    roi_data = getROI(roiId)
    
    if roi_data is not None:
        if "server_error" not in roi_data:
            for roi in roi_data:
                try: 
                    channels_data = []
                
                    for channelId in roi['associated_channel']:
                        channels_data.append(getChannel(channelId)['response']['docs'][0])
                    
                    roi['channels'] = channels_data
                except:
                    print "No attribute exists"
                print roi
            roi_data = simplejson.dumps(roi_data)
            
    return HttpResponse(roi_data, mimetype='application/json')
    
def getROI(roiId):
    query={}
    query['version'] = iqs_version
    
    try:
        query[roi_endpoints['id']] = roiId
        url = api_url + roi_acp
        url_data=urllib.urlencode(query)
        req = urllib2.Request(url, url_data)
    
        response = urllib2.urlopen(req)
        responsedata = simplejson.load(response)['response']['docs']
    except urllib2.HTTPError:
        responsedata = '{"server_error": "Server Unreachable"}'
    
    return responsedata
    
                
def getChannel(channelId):
    query={}
    query['version'] = iqs_version
    query[channel_endpoints['id']] = channelId
    url = api_url + channel_acp
    url_data=urllib.urlencode(query)
    req = urllib2.Request(url, url_data)
    
    response = urllib2.urlopen(req)
    responsedata = simplejson.load(response)
    
    return responsedata
    
#def error404(request):
#    return render(request, 'queries/html/404.html')

#Utility functions/services
def getImageURL(imageId):
    imagedata = simplejson.load(getImageData(imageId))['response']['docs']
    return  imagedata[0]['image_url']

def getImageData(imageId):
    query={}
    query['version'] = iqs_version
    
    try:
        query[image_details_endpoints['imageId']] = imageId
        url = api_url + image_details_acp
        url_data=urllib.urlencode(query)
        req = urllib2.Request(url, url_data)
    
        response = urllib2.urlopen(req)
        imagedata = response
        
        logger.debug("Query = " + simplejson.dumps(query))
        
    except urllib2.HTTPError:
        imagedata = '{"server_error": "Server Unreachable"}'
    
    return imagedata
    
def getImageDimension(imageId):
    imagedata = simplejson.load(getImageData(imageId))['response']['docs'] 
    return  [imagedata[0]['width'], imagedata[0]['height']]
    
    
def sendMail(message):
    
    if 'to' in message:
        dest = message['to']
    else:
        dest = EMAIL_DEST
        
    if 'from' in message:
        source = message['from']
    else:
        source = EMAIL_SOURCE
        
    msg = MIMEText(message['body'])
    msg['Subject'] = message['subject']
    msg['From'] = source
    msg['To'] = dest
    daemon = smtplib.SMTP('localhost')
    
    logger.debug("Sending message: "+ message['subject'])
    daemon.sendmail(source, [dest], msg.as_string())
    
    exit_message = daemon.quit()
    print exit_message
    logger.debug(exit_message)

def process_feedback(request):
    message = {}
    if request.is_ajax():
        feedback_data = request.POST
        logger.debug(feedback_data)
        message['body'] = request.POST['body']
        message['subject'] = "User Feedback - received from " + request.POST['email'] + " concerning " + request.POST['imageid']
        
        sendMail(message)
        
        message['body'] = "Your feedback concerning " + request.POST['imageid'] + " has been received. We shall treat and revert to you as soon as possible - Thank you."
        message['subject'] = "Your feedback has been received"
        message['to'] = request.POST['email']
        
        sendMail(message)
        
        message = {}
        response = {"message": "Your feedback concerning " + request.POST['imageid'] + " has been successfully received. Thank you."}
        
    else:   
        response = "Request not processed - Probably not an Ajax call"
    
    return HttpResponse(simplejson.dumps({'response' : response},ensure_ascii=False), mimetype='application/javascript')

def getDataReleases(request):
    query={}
    query['version'] = iqs_version
    
    try:
        url = api_url + getDataRelease_acp
        url_data=urllib.urlencode(query)
        req = urllib2.Request(url, url_data)
    
        response = urllib2.urlopen(req)
        responsedata = simplejson.load(response)
        
        logger.debug("Query = " + simplejson.dumps(query))
        logger.debug("==========Response============")
        logger.debug(responsedata)
       
        releasedata = simplejson.dumps(responsedata)
        
    except urllib2.HTTPError:
        releasedata = '{"server_error": "Server Unreachable"}'
  
    return HttpResponse(releasedata, mimetype='application/json')
  
    