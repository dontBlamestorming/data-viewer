from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        user = authenticate(email=request.data['email'], password=request.data['password'])
        print("USER",user)
        if user is not None:
            token = Token.objects.get(user=user)
            return Response({"token": token.key})
        else:
            return Response(status=401)