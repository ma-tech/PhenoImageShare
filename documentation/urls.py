from django.conf.urls import patterns, url
from documentation import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^news/$', views.news, name='news'),
    url(r'^about/$', views.about, name='about'),
    url(r'^search/$', views.search, name='search'),
    url(r'^detail/$', views.detail, name='detail'),
    url(r'^annotation/$', views.annotation, name='annotation'),
    url(r'^events/$', views.events, name='events'),
    #url(r'^data/$', views.release, name='data'),
    #url(r'^tools/$', views.release, name='tools'),
    url(r'^changes/$', views.release_changes, name='changes'),
    url(r'^data/$', views.release_data, name='data'),
    url(r'^license/$', views.license, name='license'),
    url(r'^bib/$', views.bib_ref, name='bib_ref'),
    url(r'^apis/$', views.api_tests, name='api_tests'),
    url(r'^apis/v100/$', views.api_tests_v100, name='api_tests_v100'),
    url(r'^apps/$', views.app_tests, name='app_tests'),
    url(r'^searchHelpTooltip/$', views.searchHelpTooltip, name='searchHelpTooltip'),
)