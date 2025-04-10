"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import AuthTokenObtainPairView, TokenObtainRefreshView
from core.gateway_view import ManagementGatewayView
from notifications.views import NotificationViewSet


router = DefaultRouter()

router.register(r'notifications', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/token/', AuthTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/token/refresh/', TokenObtainRefreshView.as_view(), name='token_obtain_refresh'),

    path('', include(router.urls)),

    path('management/<str:datatype>/', ManagementGatewayView.as_view({
        'get': 'list', 'post': 'create'
    }), name='gateway'),
    path('management/<str:datatype>/<uuid:pk>/', ManagementGatewayView.as_view({
        'get': 'retrieve', 'patch': 'update', 'delete': 'destroy'
    }), name='gateway-specific'),
]
