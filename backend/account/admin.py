from django.contrib import admin
from .models import User
# from django.contrib.auth.admin import UserAdmin


class UserAdminClass(admin.ModelAdmin):
    model = User
    list_filter = ("email", "user_name", "is_active", "is_staff")
    list_display = ("id", "email", "user_name", "is_active", "is_staff")

    fieldsets = (
        (None, {'fields' : ("email", "user_name",)}),
        ('Permissions', {'fields' : ('is_staff', 'is_active')}),
    )

    # add_fieldsets = (
    #     (None, {
    #         'classes' : ('wide',),
    #         'fields' : ('email', 'user_name', 'password1', 'password2', 'is_active', 'is_staff')
    #     })
    # )



admin.site.register(User, UserAdminClass)