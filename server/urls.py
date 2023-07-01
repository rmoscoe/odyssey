from django.urls import include, path
from rest_framework import routers
from . import views
from django.contrib.auth import views as auth_views
# from django.views.decorators.async import async_to_sync

app_name = 'server'

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'adventures', views.AdventureViewSet)
router.register(r'scenes', views.SceneViewSet)
router.register(r'encounters', views.EncounterViewSet)
router.register(r'custom-fields', views.CustomFieldViewSet)

# Supposedly GenerateAdventureView will run synchronously. If this causes problems, use async_to_sync and change the path to read path('generate-adventure/', async_to_sync(views.GenerateAdventureView.as_view()), name='generate_adventure')
urlpatterns = [
    path('', include(router.urls)),
    path('password/reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('api-auth/', include('rest_framework.urls', namespace='drf')),
    path('generate-adventure/', views.GenerateAdventureView.as_view(), name='generate_adventure'),
]