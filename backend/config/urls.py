"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users.views import CookieTokenObtainPairView, CookieTokenRefreshView, CookieTokenBlacklistView, SessionInfoView
from core.gateway_view import ManagementGatewayView
from rest_framework.routers import DefaultRouter
from notifications.views import NotificationViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('admin/', admin.site.urls),

    # Autenticación de usuarios
    path('users/token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/token/refresh/', CookieTokenRefreshView.as_view(), name='token_obtain_refresh'),
    path('users/token/blacklist/', CookieTokenBlacklistView.as_view(), name='token_blacklist'),
    path('users/token/session-info/', SessionInfoView.as_view(), name='session_info'),

    # Gateway de gestión de datos
    path('management/<str:datatype>/', ManagementGatewayView.as_view({
        'get': 'list', 'post': 'create', 'delete': 'destroy'
    }), name='gateway'),
    path('management/<str:datatype>/<uuid:pk>/', ManagementGatewayView.as_view({
        'get': 'retrieve', 'put': 'update'
    }), name='gateway-specific'),

    # Notificaciones
    path('', include(router.urls))
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
