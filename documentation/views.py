from django.shortcuts import render
from django.http import HttpResponse
from pis.settings import BASE_URL
from pis.settings import BASE_PORT

def index(request):
    return render(request, 'documentation/html/doc_index.html', '')
    
def about(request):
    return render(request, 'documentation/html/about.html', '')
    
def searchHelpTooltip(request):
    source_url = ""
    DEFAULT_PORT = 80
    
    if BASE_PORT is not DEFAULT_PORT:
        source_url = BASE_URL + ":" + str(BASE_PORT)
    else:
        source_url = BASE_URL
        
    context = {"source_url": source_url}
    return render(request, 'documentation/html/widgets/searchHelpTooltip.html', context)