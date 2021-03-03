from django.urls import path
from . import views


# pics/
urlpatterns = [
    path("", views.ImageList.as_view(), name="image_list")
]
