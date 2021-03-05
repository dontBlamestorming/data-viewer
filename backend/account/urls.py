from django.urls import path

# jwt
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# app_name = 'account/'

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
