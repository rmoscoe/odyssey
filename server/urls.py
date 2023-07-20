from django.urls import include, path
from rest_framework import routers
from . import views
# from django.contrib.auth import views as auth_views

app_name = 'server'

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'adventures', views.AdventureViewSet, basename='adventures')
router.register(r'scenes', views.SceneViewSet)
router.register(r'encounters', views.EncounterViewSet)
router.register(r'custom-fields', views.CustomFieldViewSet)

# Supposedly GenerateAdventureView will run synchronously. If this causes problems, use async_to_sync and change the path to read path('generate-adventure/', async_to_sync(views.GenerateAdventureView.as_view()), name='generate_adventure')
urlpatterns = [
    path('', include(router.urls)),
    path('password/reset/', views.CustomPasswordResetView.as_view(), name='reset_password'),
    path('password/reset/confirm/', views.CustomPasswordResetConfirmView.as_view(), name='set_new_password'),
    # path('adventures/?<user_id>', views.AdventureViewSet.as_view({'get': 'list'}), name='get_user_adventures'),
    path('generate-adventure/', views.GenerateAdventureView.as_view(), name='generate_adventure'),
    path('csrf_cookie/', views.GetCSRFToken.as_view(), name='csrf_cookie')#,
    # path('authenticated/', views.CheckAuthenticatedView.as_view(), name='authenticated')
]