"""ResPaxTestTool URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Import the include() function: from django.conf.urls import url, include
    3. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import url, include
from django.contrib import admin
from testtool import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    url(r'^test_tool/', views.test_tool, name="test_tool"),
    url(r'^generate_xml/', views.generate_xml, name="generate_xml"),
    url(r'^fill_form_xml/', views.fill_form_xml, name="fill_form_xml"),
    url(r'^submit_xml/', views.submit_xml, name="submit_xml"),
    url(r'^get_tours/', views.get_tours, name="get_tours"),
    url(r'^get_tour_bases/', views.get_tour_bases, name="get_tour_bases"),
    url(r'^get_tour_times/', views.get_tour_times, name="get_tour_times"),
    url(r'^get_tour_pickups/', views.get_tour_pickups, name="get_tour_pickups"),
    url(r'^get_all_host_info/', views.get_all_host_info, name="get_all_host_info"),
    url(r'^get_location/', views.get_location, name="get_location"),
    url(r'^logout/', views.logout, name="logout"),
    url(r'^login_error/', views.login_error, name="login_error"),
    url(r'^$', views.login, name="login"),
    url(r'^admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
