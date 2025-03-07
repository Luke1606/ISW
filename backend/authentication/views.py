from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from . import serializers


class LoginTokenObtainPairView(TokenObtainPairView):
    serializer_class = serializers.LoginTokenObtainPairSerializer
