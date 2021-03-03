from django.db import models
import uuid


class Image(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source_image = models.ForeignKey(
        "SourceImage",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="image_set",
    )
    valid_image = models.ForeignKey(
        "ValidImage",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="image_set",
    )
    fake_image = models.ForeignKey(
        "FakeImage",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="image_set",
    )


class SourceImage(models.Model):  # will be _x
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    img = models.ImageField(upload_to="pictures/source")


class ValidImage(models.Model):  # will be _y
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    img = models.ImageField(upload_to="pictures/valid")


class FakeImage(models.Model):  # will be _fake
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    img = models.ImageField(upload_to="pictures/fake")


"""
    User에 따라서 보내는 사진 데이터가 달라진다면?
    아래와 같은 인증 account app의 user model과 어떻게 Join 시킬지 고민할 것
    
    class Dataset(models.Model):
        user = models.ForeignKey(
            settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="dataset_set"
        )
"""
