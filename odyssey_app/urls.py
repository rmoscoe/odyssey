from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

api_prefix = 'api/'

urlpatterns = [
    path('admin/', admin.site.urls),
    path(api_prefix, include('server.urls', namespace='server')),
]

urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += [
    re_path(r'.*', TemplateView.as_view(template_name='index.html')),
]