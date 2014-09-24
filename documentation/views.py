from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, 'documentation/html/index.html', '')
    
def about(request):
    return render(request, 'documentation/html/about.html', '')