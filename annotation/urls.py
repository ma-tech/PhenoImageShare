from django.conf.urls import patterns, url
from annotation import views

urlpatterns = patterns('',
    #URLs for ajax calls to the IQS.
    url(r'^$', views.drawing_view, name='drawing_view'),
    url(r'^old$', views.drawing_view_old, name='drawing_view_old'),
    url(r'^save_annotations$', views.save_annotations, name='save_annotations'),
    url(r'^getTree$', views.getTree, name='getTree'),
)