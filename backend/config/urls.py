"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users import urls
from core.gateway_view import ManagementGatewayView
from rest_framework.routers import DefaultRouter
from notifications.views import NotificationViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('admin/', admin.site.urls),

    # Endpoints de autenticación y gestión de sesiones
    path('users/', include('users.urls')),

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
