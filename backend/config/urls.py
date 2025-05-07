"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path
from users.views import CookieTokenObtainPairView, CookieTokenRefreshView, CookieTokenBlacklistView, SessionInfoView
from core.gateway_view import ManagementGatewayView
from notifications.views import NotificationViewSet

urlpatterns = [
    path('admin/', admin.site.urls),

    path('users/token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/token/refresh/', CookieTokenRefreshView.as_view(), name='token_obtain_refresh'),
    path('users/token/blacklist/', CookieTokenBlacklistView.as_view(), name='token_blacklist'),
    path('users/token/session-info/', SessionInfoView.as_view(), name='session_info'),

    path('management/<str:datatype>/', ManagementGatewayView.as_view({
        'get': 'list', 'post': 'create'
    }), name='gateway'),
    path('management/<str:datatype>/<uuid:pk>/', ManagementGatewayView.as_view({
        'get': 'retrieve', 'patch': 'update', 'delete': 'destroy'
    }), name='gateway-specific'),

    path('notifications/', NotificationViewSet.as_view(), name='notifications')
]
