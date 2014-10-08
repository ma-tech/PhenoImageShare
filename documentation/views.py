from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, 'documentation/html/doc_index.html', '')
    
def about(request):
    return render(request, 'documentation/html/about.html', '')