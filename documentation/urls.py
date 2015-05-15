from django.conf.urls import patterns, url
from documentation import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^about/$', views.about, name='about'),
    url(r'^search/$', views.search, name='search'),
    url(r'^detail/$', views.detail, name='detail'),
    url(r'^events/$', views.events, name='events'),
    url(r'^data/$', views.release, name='data'),
    url(r'^tools/$', views.release, name='tools'),
    url(r'^changes/$', views.release, name='changes'),
    url(r'^license/$', views.license, name='license'),
    url(r'^searchHelpTooltip/$', views.searchHelpTooltip, name='searchHelpTooltip'),
)