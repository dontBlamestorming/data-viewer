from django.conf import settings
from django.db import models

'''
class Dataset(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="dataset_set"
    )

class Data(models.Model):
    source = models.ImageField()
    valid = models.ImageField()
    fake = models.ImageField()
'''

class Source(models.Model):
    # SOURCE = 0
    # VALID = 1
    # FAKE = 2

    # dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='source_set')
    # data = models.ForeignKey(Data, on_delete=models.CASCADE, related_name="image_set")
    image = models.ImageField("사진 이미지", upload_to="pictures")  # needed Pillow
    # type_ = models.IntegerField()

    # def __str__(self):
    #     return self.image_url


"""
django models
1:1, 1:N, N:N relations

서버쪽에서 
_x -> 원본 source
_y -> validate (사람이 작업한 사진)
_z? -> fake 사진
"""

# on_delete=models.CASCADE
# ForeignKeyField가 바라보는 값이 삭제될 때 ForeignKeyField를 포함하는 모델 인스턴스(row)도 삭제된다.