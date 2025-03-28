"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
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
    path('management/<str:datatype>/<int:pk>/', ManagementGatewayView.as_view({
        'get': 'retrieve', 'put': 'update', 'delete': 'destroy'
    }), name='gateway-specific'),
]
