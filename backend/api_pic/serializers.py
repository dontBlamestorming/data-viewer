from rest_framework import serializers
from .models import Source

class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ['image']

    # def get_image_url(self):