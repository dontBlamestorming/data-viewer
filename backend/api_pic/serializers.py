from rest_framework import serializers
from .models import Image


class ImageSerializer(serializers.ModelSerializer):

    source = serializers.ImageField(source="source_image.img")
    valid = serializers.ImageField(source="valid_image.img")
    fake = serializers.ImageField(source="fake_image.img")

    class Meta:
        model = Image
        fields = ["id", "source", "valid", "fake"]
