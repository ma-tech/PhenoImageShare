from django.shortcuts import render
from django.http import HttpResponse

try: from pis.settings import BASE_URL
except ImportError: BASE_URL="http://dev.phenoimageshare.org"

try: from pis.settings import BASE_PORT
except ImportError: BASE_PORT=80

def index(request):
    return render(request, 'documentation/html/documentation_index.html', '')
    
def about(request):
    return render(request, 'documentation/html/about.html', '')

def search(request):
    return render(request, 'documentation/html/search.html', '')

def detail(request):
    return render(request, 'documentation/html/detail.html', '')

def events(request):
    return render(request, 'documentation/html/events.html', '')
    
    
def searchHelpTooltip(request):
    source_url = ""
    DEFAULT_PORT = 80
    
    if BASE_PORT is not DEFAULT_PORT:
        source_url = BASE_URL + ":" + str(BASE_PORT)
    else:
        source_url = BASE_URL
        
    context = {"source_url": source_url}
    return render(request, 'documentation/html/widgets/searchHelpTooltip.html', context)