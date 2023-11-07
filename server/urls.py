from django.urls import include, path
from rest_framework import routers
from . import views

app_name = 'server'

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'adventures', views.AdventureViewSet, basename='adventures')
router.register(r'scenes', views.SceneViewSet)
router.register(r'encounters', views.EncounterViewSet)
router.register(r'custom-fields', views.CustomFieldViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('password/reset/', views.CustomPasswordResetView.as_view(), name='reset_password'),
    path('password/reset/confirm/', views.CustomPasswordResetConfirmView.as_view(), name='set_new_password'),
    path('generate-adventure/', views.GenerateAdventureView.as_view(), name='generate_adventure'),
    path('csrf_cookie/', views.GetCSRFToken.as_view(), name='csrf_cookie')#,
]