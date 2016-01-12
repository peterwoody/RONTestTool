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
from testtool.views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    url(r'^test_tool/', test_tool, name="test_tool"),
    url(r'^get_tours/', get_tours, name="get_tours"),
    url(r'^get_tour_bases/', get_tour_bases, name="get_tour_bases"),
    url(r'^get_tour_times/', get_tour_times, name="get_tour_times"),
    url(r'^get_tour_pickups/', get_tour_pickups, name="get_tour_pickups"),
    url(r'^logout/', logout, name="logout"),
    url(r'^login_error/', login_error, name="login_error"),
    url(r'^$', login, name="login"),
    url(r'^admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
