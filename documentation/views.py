from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader, Context
import logging

logger = logging.getLogger(__name__)

try: from pis.settings import BASE_URL
except ImportError: BASE_URL="http://dev.phenoimageshare.org"

try: from pis.settings import BASE_PORT
except ImportError: BASE_PORT=80

def index(request):
    return render(request, 'documentation/html/documentation_index.html', '')
    
def about(request):
    logger.debug("Path = " + request.path)
    return render(request, 'documentation/html/about.html', '')

def search(request):
    return render(request, 'documentation/html/search.html', '')

def detail(request):
    return render(request, 'documentation/html/detail.html', '')

def events(request):
    return render(request, 'documentation/html/events.html', '')
    
def release(request):
    response = HttpResponse(content_type='text/plain')
    t = loader.get_template('documentation/html/release/changelog')
    c = Context({})
    response.write(t.render(c))
        
    return response

def license(request):
    response = HttpResponse(content_type='text/plain')
    t = loader.get_template('documentation/html/release/license')
    c = Context({})
    response.write(t.render(c))
        
    return response

def bib_ref(request):
    response = HttpResponse(content_type='text/plain')
    t = loader.get_template('documentation/html/pub_refs/phis_phenoday_15.bib')
    c = Context({})
    response.write(t.render(c))
        
    return response
    
def searchHelpTooltip(request):
    source_url = ""
    DEFAULT_PORT = 80
    
    if BASE_PORT is not DEFAULT_PORT:
        source_url = BASE_URL + ":" + str(BASE_PORT)
    else:
        source_url = BASE_URL
        
    context = {"source_url": source_url}
    return render(request, 'documentation/html/widgets/searchHelpTooltip.html', context)
    
def api_tests(request):
    return render(request, 'documentation/html/tests/apis.html', '')
    
def app_tests(request):
    return render(request, 'documentation/html/tests/apps.html', '')