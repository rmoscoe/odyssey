from django.urls import include, path
from rest_framework import routers
from . import views
from django.contrib.auth import views as auth_views

app_name = 'server'

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'adventures', views.AdventureViewSet)
router.register(r'scenes', views.SceneViewSet)
router.register(r'encounters', views.EncounterViewSet)
router.register(r'custom-fields', views.CustomFieldViewSet)
router.register(r'password', views.PasswordResetViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('password/reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password/reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('password/reset/confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password/reset/complete/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('api-auth/', include('rest_framework.urls', namespace='drf')),
]