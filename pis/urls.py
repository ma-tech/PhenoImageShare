from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
from queries import views as qviews

admin.autodiscover()

# URL design and patterns for PhIS application modules.
urlpatterns = patterns('',
    # Index view for PhIS web applications.
    url(r'^$', qviews.index, name='index'),
    
    # URL patters to the views of the Query application.
    url(r'^search/', include('queries.urls', namespace="queries")),
    url(r'^documentation/', include('documentation.urls', namespace="documentation")),
    url(r'^pub_refs/', include('documentation.urls', namespace="pub_refs")),
    url(r'^release/', include('documentation.urls', namespace="release")),
    url(r'^tests/', include('documentation.urls', namespace="tests")),
    url(r'^admin/', include(admin.site.urls)),
    
    # URL patters for the views of the Annotation application.
    url(r'^annotation/', include('annotation.urls', namespace="annotation")),
    #url(r'^submission/', include('queries.urls', namespace="submission")),
)

#handler404 = 'qviews.error404'