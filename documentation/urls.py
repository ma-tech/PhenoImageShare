from django.conf.urls import patterns, url
from documentation import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^about/$', views.about, name='about'),
    url(r'^searchHelpTooltip/$', views.searchHelpTooltip, name='searchHelpTooltip'),
)