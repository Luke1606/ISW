from django.urls import path
from .views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    CookieTokenBlacklistView,
    UserAPIView,
)

urlpatterns = [
    # Endpoints de autenticación con JWT gestionado por cookies
    path('token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_obtain_refresh'),
    path('token/blacklist/', CookieTokenBlacklistView.as_view(), name='token_blacklist'),

    # Información y cambio de contraseña del usuario autenticado
    path('token/session/', UserAPIView.as_view(), name='session'),
]
