from django.shortcuts import get_object_or_404

# Generic View
from django.views.generic.list import ListView

# Model
from .models import Data

# serializer
from .serializers import DataSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def pics_list(request):
    datas = Data.objects.all()
    serializer = DataSerializer(datas, many=True)

    return Response(serializer.data)

'''
    @api_view(["GET"])
    class PicsList(ListView):
        model = Data    # same as 'Data.objects.all()'
        serializer = DataSerializer(model, many=True)
'''



'''
Data.objects.all()
<QuerySet [<Data: Data object (1)>, <Data: Data object (2)>, <Data: Data object (3)>, <Data: Data object (4)>, <Data: Data object (5)>]>

Data.objects.get(pk=1)

'''