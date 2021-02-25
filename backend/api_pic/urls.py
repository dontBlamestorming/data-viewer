from django.urls import path
from . import views

urlpatterns = [
    path("", views.pics_list)
]
