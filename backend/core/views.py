import posixpath

from pathlib import Path

from django.conf import settings
from django.utils._os import safe_join
from django.views.static import serve

from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response


@api_view(http_method_names=["GET"])
def file_view(request, path):
    path = posixpath.normpath(path).lstrip("/")

    data_root = settings.BASE_DIR / "data_root"
    target_path = Path(safe_join(data_root, path))

    print("auth", request.auth)

    if target_path.is_dir():
        res = [
            {
                "path": "/" + str(p.relative_to(data_root)),
                "size": p.stat().st_size,
                "isDir": p.is_dir(),
            }
            for p in target_path.iterdir()
        ]
        return Response(res)

    elif target_path.is_file():
        return serve(request, path, document_root=data_root)

    else:
        raise NotFound()
