from django.urls import path

# views
from .views import CustomUserCreate

# jwt
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

# app_name = 'account/'

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", CustomUserCreate.as_view(), name="create_user"),
]
