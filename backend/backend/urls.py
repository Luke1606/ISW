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
from django.urls import path
from users.views import AuthTokenObtainPairView, TokenObtainRefreshView
from .management_gateway_view import ManagementGatewayView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/token/', AuthTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/token/refresh/', TokenObtainRefreshView.as_view(), name='token_obtain_refresh'),
    path('management/<str:datatype>/', ManagementGatewayView.as_view({
            'get': 'list',          # Asocia GET con la acción 'list'
            'post': 'create',       # Asocia POST con la acción 'create'
            'put': 'update',        # Asocia PUT con la acción 'update'
            'delete': 'destroy',    # Asocia DELETE con la acción 'destroy'
        }), name='gateway_view'),
]
