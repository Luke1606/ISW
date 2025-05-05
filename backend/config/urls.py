"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserInfoView, CookieTokenObtainPairView, CookieTokenRefreshView, CookieTokenBlacklistView
from core.gateway_view import ManagementGatewayView
from notifications.views import NotificationViewSet

router = DefaultRouter()

router.register(r'notifications', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/token/refresh/', CookieTokenRefreshView.as_view(), name='token_obtain_refresh'),
    path('users/token/blacklist/', CookieTokenBlacklistView.as_view(), name='token_blacklist'),
    path('users/token/session-info/', UserInfoView.as_view(), name='session_info'),

    path('', include(router.urls)),

    path('management/<str:datatype>/', ManagementGatewayView.as_view({
        'get': 'list', 'post': 'create'
    }), name='gateway'),
    path('management/<str:datatype>/<uuid:pk>/', ManagementGatewayView.as_view({
        'get': 'retrieve', 'patch': 'update', 'delete': 'destroy'
    }), name='gateway-specific'),
]
