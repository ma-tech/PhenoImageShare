from django.conf.urls import patterns, url
from annotation import views

urlpatterns = patterns('',
    #URLs for ajax calls to the IQS.
    url(r'^$', views.drawing_view, name='drawing_view'),
    url(r'^zoomable$', views.drawing_zoomable, name='drawing_zoomable'),
    url(r'^old$', views.drawing_view_old, name='drawing_view_old'),
    url(r'^save_annotations$', views.save_annotations, name='save_annotations'),
    url(r'^addAnnotation$', views.addAnnotation, name='addAnnotation'),
    url(r'^updateAnnotation$', views.updateAnnotation, name='updateAnnotation'),        
    url(r'^getTree$', views.getTree, name='getTree'),
    url(r'^ontologies$', views.getOntologies, name='ontologies'),
    url(r'^site_config$', views.site_config, name='site_config'),
    url(r'^tool$', views.annotation_tool, name='tool'),
        
    #URL to test MVC-based library
    url(r'^mvc$', views.mvc, name='mvc'),
)