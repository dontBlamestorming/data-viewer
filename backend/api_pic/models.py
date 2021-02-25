from django.db import models


class Data(models.Model):
    source = models.ImageField(upload_to="pictures/source")
    valid = models.ImageField(upload_to="pictures/valid")
