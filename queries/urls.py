from django.conf.urls import patterns, url
from queries import views

urlpatterns = patterns('',
    url(r'^$', views.query_view, name='query_view'),
    url(r'^detail/$', views.detail_view, name='detail_view'),
    url(r'^detail/getRoiData$', views.get_roi_data, name='get_roi_data'),
    
    #URLs for ajax calls to the IQS.
    url(r'^getImages/$', views.getImages, name='getImages'),
    url(r'^getAutosuggest/$', views.getAutosuggest, name='getAutosuggest'),
    url(r'^feedback/$', views.process_feedback, name='feedback'),
    url(r'^getDataReleases/$', views.getDataReleases, name='data_release'),
)