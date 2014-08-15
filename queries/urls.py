from django.conf.urls import patterns, url
from queries import views

urlpatterns = patterns('',
    url(r'^$', views.query_view, name='query_view'),
    url(r'^detail/$', views.detail_view, name='detail_view'),
    
    #URLs for ajax calls to the IQS.
    url(r'^getImages/$', views.getImages, name='getImages'),
)