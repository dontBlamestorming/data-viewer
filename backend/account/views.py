from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import AuthTokenSerializer


class LoginView(ObtainAuthToken):
    serializer_class = AuthTokenSerializer


@api_view(http_method_names=["GET"])
def profile(request):
    return Response(
        {
            "email": request.user.email,
        }
    )
