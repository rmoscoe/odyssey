from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

api_prefix = 'api/'

urlpatterns = [
    path('admin/', admin.site.urls),
    path(api_prefix, include('server.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += [
    path('api/', include('server.urls')),
    re_path('.*', TemplateView.as_view(template_name='index.html')),
]