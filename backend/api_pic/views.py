from django.shortcuts import render, get_object_or_404

# Model
from .models import Source

# serializer
from .serializers import SourceSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response

# http
from django.http import JsonResponse

# "제너릭 뷰 사용하기
@api_view(['GET'])
def pics_list(request, pics_id):
    source = get_object_or_404(Source, pk=pics_id)  # 해당 pk이 DoesNotExist인 경우 404
    serializer = SourceSerializer(source)
    # print(source.image.url)
    return Response(serializer.data)

'''
    http://localhost:8000/showing_pics/pics/1 => x, y
    json = {
        id : '',
        pics : {
            pic_path_x : 'other server',
            pic_path_y : 'ohter server',
        }
    }
'''