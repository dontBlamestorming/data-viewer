from django.contrib import admin
from .models import Image, SourceImage, ValidImage, FakeImage


class SourceImageInline(admin.TabularInline):
    model = SourceImage


class ImageAdmin(admin.ModelAdmin):
    # list_display = ['id', 'source_image', 'valid_image', 'fake_image']
    # fields = ['source_image', 'valid_image', 'fake_image']

    fieldsets = [
        ("IMAGES", {"fields": ["source_image", "valid_image", "fake_image"]}),
    ]


admin.site.register(Image, ImageAdmin)
admin.site.register(SourceImage)
admin.site.register(ValidImage)
admin.site.register(FakeImage)

"""
    SourceImage, ValidImage, FakeImage를 등록하지 않으면 ImageAdmin에서도 사진 추가가 안된다.
    -> ImageAdmin으로 3개의 파일을 한번에 추가할 수 있도록 바꿔야 함
    
    추측 : SourceImage, ValidImage, FakeImage에서 역참조가 안되니까 파일도 수정할수가 없는듯하다.
"""
