# Drf
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

# Serializer
from .serializers import RegisterUserSerializer


# account/register
class CustomUserCreate(APIView):
    permission_classes = (IsAuthenticated,)
    ''' permission_classes = (IsAuthenticated,) 
        인증되지 않은 사용자의 permission을 거부, 등록된 사용자에게만 API access를 허용  '''

    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)

        if serializer.is_valid(): # User 모델의 create 메서드가 정상적으로 추가할 값을 인지하고 return한 경우
            newuser = serializer.save()

            if newuser:
                return Response(status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)







