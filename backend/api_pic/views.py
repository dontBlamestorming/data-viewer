# Model
from .models import Image

# Drf
from rest_framework.views import APIView

# serializer
from .serializers import ImageSerializer
from rest_framework.response import Response


class ImageList(APIView):
    def get(self, request):
        queryset = Image.objects.all()
        serializer = ImageSerializer(queryset, many=True)

        return Response(serializer.data)

    """
    def post(self, request):
        return Response("When access by POST method")
    """
