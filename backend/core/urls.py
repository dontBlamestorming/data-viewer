from django.urls import re_path

from . import views


urlpatterns = [
    re_path(r"^browse/(?P<path>.*)$", views.file_view),
]
